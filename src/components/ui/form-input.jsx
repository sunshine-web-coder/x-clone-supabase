import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function FormInput({ control, name, label, type = 'text', placeholder }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[var(--white)]">{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field}  className="text-[var(--white)]" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
