
import React, { useState, useEffect } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CategoryAttribute, CategoryFilter } from '@/context/ProductContext';
import { capitalizeWords } from '@/lib/utils';

interface DynamicFilterProps {
  categoryFilter: CategoryFilter;
  onFilterChange: (attribute: string, value: any) => void;
  activeFilters: Record<string, any>;
}

export const DynamicFilter = ({ 
  categoryFilter,
  onFilterChange,
  activeFilters 
}: DynamicFilterProps) => {
  
  const renderFilter = (attribute: CategoryAttribute) => {
    const { name, type } = attribute;
    const displayName = capitalizeWords(name.replace(/([A-Z])/g, ' $1'));
    
    switch (type) {
      case 'select':
        return (
          <div className="space-y-2" key={name}>
            <h4 className="font-medium text-sm">{displayName}</h4>
            <div className="space-y-1.5">
              {attribute.options?.map(option => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox 
                    id={`${name}-${option}`} 
                    checked={Array.isArray(activeFilters[name]) && activeFilters[name]?.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const currentValues = Array.isArray(activeFilters[name]) 
                          ? activeFilters[name] 
                          : [];
                        onFilterChange(name, [...currentValues, option]);
                      } else {
                        onFilterChange(
                          name, 
                          (activeFilters[name] || []).filter((v: string) => v !== option)
                        );
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`${name}-${option}`}
                    className="text-sm leading-none font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
                
      case 'range':
        const min = attribute.min || 0;
        const max = attribute.max || 100;
        const currentMin = activeFilters[`${name}_min`] !== undefined 
          ? activeFilters[`${name}_min`] 
          : min;
        const currentMax = activeFilters[`${name}_max`] !== undefined 
          ? activeFilters[`${name}_max`] 
          : max;
        
        return (
          <div className="space-y-3" key={name}>
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">{displayName}</h4>
              <div className="text-xs text-muted-foreground">
                {currentMin} - {currentMax} {attribute.unit}
              </div>
            </div>
            
            <Slider
              defaultValue={[currentMin, currentMax]}
              min={min}
              max={max}
              step={(max - min) / 100}
              onValueChange={(value) => {
                onFilterChange(`${name}_min`, value[0]);
                onFilterChange(`${name}_max`, value[1]);
              }}
              className="my-6"
            />
          </div>
        );
                
      default:
        return null;
    }
  };
  
  return (
    <Accordion type="multiple" defaultValue={['brand']} className="space-y-2">
      {categoryFilter.attributes.map((attribute) => (
        <AccordionItem 
          key={attribute.name} 
          value={attribute.name}
          className="border rounded-lg px-3 bg-card"
        >
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            {capitalizeWords(attribute.name.replace(/([A-Z])/g, ' $1'))}
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            {renderFilter(attribute)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default DynamicFilter;
