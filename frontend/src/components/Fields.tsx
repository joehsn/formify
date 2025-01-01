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
import { FormType, FieldType } from '@/lib/schemas/form.schema';
import useFormStore from '@/lib/stores/form.store';
import { cn } from '@/lib/utils';
import { produce } from 'immer';
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

function Field() {
  const form = useFormStore((state) => state.form);
  const setForm = useFormStore((state) => state.setForm);
  return (
    <>
      {form.fields.map((field) => (
        <Card aria-label="Field" key={field.fieldId}>
          <CardHeader
            className={cn('flex flex-row items-center justify-between gap-4')}
          >
            <input
              type="text"
              value={field.label}
              aria-label="Field label"
              className="w-full border-b py-1 text-lg font-bold outline-none focus:border-neutral-900"
              onChange={(e) => {
                setForm(
                  produce(form, (state: FormType) => {
                    const index = state.fields.findIndex(
                      (f) => f.fieldId === field.fieldId
                    );
                    state.fields[index].label = e.target.value;
                  })
                );
              }}
              onFocus={(e) => {
                if (e.target.value === 'Untitled Field') {
                  setForm(
                    produce(form, (state: FormType) => {
                      const index = state.fields.findIndex(
                        (f) => f.fieldId === field.fieldId
                      );
                      state.fields[index].label = '';
                    })
                  );
                }
              }}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setForm(
                    produce(form, (state: FormType) => {
                      const index = state.fields.findIndex(
                        (f) => f.fieldId === field.fieldId
                      );
                      state.fields[index].label = 'Untitled Field';
                    })
                  );
                }
              }}
            />
            <Select
              defaultValue={field.type}
              onValueChange={(newType: FieldType['type']) => {
                setForm(
                  produce(form, (state: FormType) => {
                    const index = state.fields.findIndex(
                      (f) => f.fieldId === field.fieldId
                    );
                    state.fields[index].type = newType;
                    if (['radio', 'checkbox', 'dropdown'].includes(newType)) {
                      state.fields[index].options = ['Option 1', 'Option 2'];
                    } else {
                      state.fields[index].options = undefined;
                    }
                  })
                );
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
                      onOptionChange={(newOption) =>
                        setForm(
                          produce(form, (state: FormType) => {
                            const fieldIndex = state.fields.findIndex(
                              (f) => f.fieldId === field.fieldId
                            );
                            if (!state.fields[fieldIndex].options) {
                              state.fields[fieldIndex].options = [];
                            }
                            state.fields[fieldIndex].options[index] = newOption;
                          })
                        )
                      }
                    />
                  ))}
                  <Button
                    aria-label="Add new option"
                    variant="outline"
                    onClick={() =>
                      setForm(
                        produce(form, (state: FormType) => {
                          const index = state.fields.findIndex(
                            (f) => f.fieldId === field.fieldId
                          );
                          state.fields[index].options?.push(
                            'Option ' +
                              (state.fields[index].options?.length + 1)
                          );
                        })
                      )
                    }
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
                id={field.fieldId + '-required-switch'}
                checked={field.required}
                onCheckedChange={() => {
                  setForm(
                    produce(form, (state: FormType) => {
                      const index = state.fields.findIndex(
                        (f) => f.fieldId === field.fieldId
                      );
                      state.fields[index].required =
                        !state.fields[index].required;
                    })
                  );
                }}
              />
              <Label htmlFor={field.fieldId + '-required-switch'}>
                Required
              </Label>
            </div>
            <div>
              <Button
                variant="destructive"
                disabled={form.fields.length === 1}
                onClick={() => {
                  setForm(
                    produce(form, (state: FormType) => {
                      state.fields = state.fields.filter(
                        (f) => f.fieldId !== field.fieldId
                      );
                    })
                  );
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
}

export default Field;
