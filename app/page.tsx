"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, CalendarX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EUnidades } from '@/lib/types';
import { fetchAvailableMonthDates, fetchAvailableTimeSlots } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';

const unidades = [
  { id: EUnidades.MESSEJANA, name: 'Messejana', value: 'messejana' },
  { id: EUnidades.ANT_BEZERRA, name: 'Antônio Bezerra', value: 'ant-bezerra' },
  { id: EUnidades.CENTRO, name: 'Centro', value: 'centro' },
  { id: EUnidades.PARANGABA, name: 'Parangaba', value: 'parangaba' },
];

export default function Home() {
  const [selectedUnit, setSelectedUnit] = useState<number>(EUnidades.CENTRO);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnitName, setSelectedUnitName] = useState<string>(unidades[1].name);

  const currentMonth = format(new Date(), 'MM/yyyy');

  useEffect(() => {
    fetchDates();
  }, [selectedUnit]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimes();
    }
  }, [selectedDate]);

  const fetchDates = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAvailableMonthDates(selectedUnit, currentMonth);
      setAvailableDates(response.value.diasDoMes);
      if (response.value.diasDoMes.length > 0) {
        setSelectedDate(response.value.diasDoMes[0]);
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
    setIsLoading(false);
  };

  const fetchTimes = async () => {
    if (!selectedDate) return;
    setIsLoading(true);
    try {
      const response = await fetchAvailableTimeSlots(selectedUnit, selectedDate);
      const times = response.value[0]?.horarios || [];
      setAvailableTimeSlots(times);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
    setIsLoading(false);
  };

  const handleTabChange = (value: string) => {
    const unit = unidades.find(u => u.value === value);
    if (unit) {
      setSelectedUnit(unit.id);
      setSelectedUnitName(unit.name);
    }
  };

  const getDefaultTab = () => {
    const unit = unidades.find(u => u.id === selectedUnit);
    return unit?.value || unidades[0].value;
  };

  const EmptyState = () => (
    <div className="text-center py-8">
      <CalendarX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum horário disponível
      </h3>
      <p className="text-gray-500">
        No momento não há horários disponíveis para esta unidade.
        Por favor, tente novamente mais tarde ou selecione outra unidade.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Agendamento de Identidade
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Horários disponíveis para emissão de identidade na unidade: {selectedUnitName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={getDefaultTab()} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="w-full grid grid-cols-3">
                {unidades.map((unidade) => (
                  <TabsTrigger
                    key={unidade.value}
                    value={unidade.value}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    {unidade.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {unidades.map((unidade) => (
                <TabsContent key={unidade.value} value={unidade.value} className="space-y-6">
                  {/* Available Dates */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Datas Disponíveis
                    </label>
                    {availableDates.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableDates.map((date) => (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                              "p-3 rounded-lg text-sm font-medium transition-colors",
                              selectedDate === date
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            )}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    ) : !isLoading && <EmptyState />}
                  </div>

                  {/* Available Time Slots */}
                  {selectedDate && availableTimeSlots.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Horários Disponíveis
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            className="p-3 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="text-center text-gray-600 max-w-[50%] mx-auto">
                      Carregando...
                      <Progress /> 
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}