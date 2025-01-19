import { forwardRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldType } from '@/types';
import useCreateFormStore from '@/lib/stores/create.store';
import { cn } from '@/lib/utils';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import Option from './Option';

const types = [
  'text',
  'email',
  'number',
  'radio',
  'checkbox',
  'dropdown',
  'date',
];

const CreateFields = forwardRef<HTMLDivElement>((_, ref) => {
  const form = useCreateFormStore((state) => state.form);
  const setFieldLabel = useCreateFormStore((state) => state.setFieldLabel);
  const setFieldType = useCreateFormStore((state) => state.setFieldType);
  const setFieldRequired = useCreateFormStore(
    (state) => state.setFieldRequired
  );
  const removeField = useCreateFormStore((state) => state.removeFormField);
  const setFieldOption = useCreateFormStore((state) => state.setFieldOption);
  const addFieldOption = useCreateFormStore((state) => state.addFieldOption);
  const removeFieldOption = useCreateFormStore(
    (state) => state.removeFieldOption
  );

  return (
    <>
      {form.fields.map((field, index) => (
        <Card
          aria-label="Field"
          key={field._id}
          ref={index === form.fields.length - 1 ? ref : null}
        >
          <CardHeader
            className={cn('flex flex-row items-center justify-between gap-4')}
          >
            <input
              type="text"
              value={field.label}
              aria-label="Field label"
              className="w-full border-b py-1 text-lg font-bold outline-none focus:border-neutral-900"
              onChange={(e) => setFieldLabel(field._id, e.target.value)}
              onFocus={(e) => {
                if (e.target.value === 'Untitled Field') {
                  setFieldLabel(field._id, '');
                }
              }}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setFieldLabel(field._id, 'Untitled Field');
                }
              }}
            />
            <Select
              defaultValue={field.type}
              onValueChange={(newType: FieldType['type']) => {
                setFieldType(field._id, newType);
              }}
            >
              <SelectTrigger className="w-[180px] capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-4">
              {['text', 'number', 'email'].includes(field.type) ? (
                <Input
                  placeholder={`I.e. ${
                    field.type === 'text'
                      ? 'Lorem Ipsum...'
                      : field.type === 'number'
                        ? '123456789'
                        : 'example@domain.com'
                  }`}
                  disabled
                />
              ) : ['radio', 'checkbox', 'dropdown'].includes(field.type) ? (
                <>
                  {field.options?.map((option, index) => (
                    <Option
                      key={index}
                      option={option}
                      index={index}
                      fieldType={
                        field.type as 'radio' | 'checkbox' | 'dropdown'
                      }
                      optionsLength={field.options ? field.options.length : 2}
                      onOptionChange={(newOption) =>
                        setFieldOption(field._id, index, newOption)
                      }
                      onOptionDelete={() => removeFieldOption(field._id, index)}
                    />
                  ))}
                  {/* FIXME: add field option does not work */}
                  <Button
                    aria-label="Add new option"
                    variant="outline"
                    onClick={() => addFieldOption(field._id)}
                  >
                    <FaPlus size={32} />
                    New Option
                  </Button>
                </>
              ) : (
                <div>
                  <Input type="date" disabled />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className={cn('flex items-center justify-end gap-4')}>
            <div className="flex items-center space-x-2">
              <Switch
                id={field._id + '-required-switch'}
                checked={field.required}
                onCheckedChange={() => {
                  setFieldRequired(field._id, !field.required);
                }}
              />
              <Label htmlFor={field._id + '-required-switch'}>Required</Label>
            </div>
            <div>
              <Button
                variant="destructive"
                disabled={form.fields.length === 1}
                onClick={() => {
                  removeField(field._id);
                }}
              >
                <FaTrash size={24} />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
});

export default CreateFields;
