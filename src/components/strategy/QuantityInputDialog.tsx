
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface QuantityInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(1, "Quantity must be at least 1")
    .multipleOf(75, "Quantity must be a multiple of 75")
});

export const QuantityInputDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: QuantityInputDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 75
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Close the dialog before triggering the callback to prevent UI hang
    onOpenChange(false);
    
    // Slight delay to ensure dialog closes first
    setTimeout(() => {
      onConfirm(values.quantity);
      form.reset({ quantity: 75 });
    }, 100);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setTimeout(onCancel, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Enter Trading Quantity</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please enter a quantity in multiples of 75.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step={75}
                      min={75}
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button 
                type="button"
                variant="secondary" 
                className="bg-gray-700 hover:bg-gray-600 text-gray-200"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                OK
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
