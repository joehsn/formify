import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FaStarOfLife } from 'react-icons/fa6';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import useDefaultValues from '@/hooks/use-default-values';
import { DatePicker } from '@/components/DatePicker';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { FieldType } from '@/types';
import { cn, generateSchema } from '@/lib/utils';
import { handleSaveResponse } from '@/lib/handlers';

interface Props {
  formId: string;
  fields: FieldType[];
}
function DisplayFields({ formId, fields }: Props) {
  const schema = generateSchema(fields).extend({
    email: z
      .string()
      .nonempty('Email is required')
      .email('Must be a valid email'),
  });
  const defaultValues = useDefaultValues(fields);

  const formHook = useForm<z.infer<typeof schema> & { email: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      ...defaultValues,
    },
  });

  const onSubmit = async (data: Record<string, string | string[]>) => {
    try {
      await handleSaveResponse(formId, data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...formHook}>
      <form onSubmit={formHook.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <FormField
            control={formHook.control}
            name="email"
            render={({ field, formState }) => (
              <FormItem className={cn('space-y-0')}>
                <CardHeader>
                  <FormLabel
                    className={cn('text-xl font-bold first-letter:capitalize')}
                  >
                    <span>Email</span>
                    <FaStarOfLife className="ml-1 inline-block h-3 w-3 align-top text-red-400" />
                  </FormLabel>
                </CardHeader>
                <CardContent>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                </CardContent>
                {formState.errors.email && (
                  <CardFooter>
                    <FormMessage />
                  </CardFooter>
                )}
              </FormItem>
            )}
          />
        </Card>
        {fields.map((singleField: FieldType) => (
          <Card key={singleField._id}>
            {singleField.type === 'radio' ? (
              <FormField
                control={formHook.control}
                name={singleField._id}
                render={({ field, fieldState }) => (
                  <FormItem className={cn('space-y-0')}>
                    <CardHeader>
                      <FormLabel
                        className={cn(
                          'text-xl font-bold first-letter:capitalize'
                        )}
                      >
                        {singleField.label}
                        {singleField.required && (
                          <FaStarOfLife className="ml-1 inline-block h-3 w-3 align-top text-red-400" />
                        )}
                      </FormLabel>
                    </CardHeader>
                    <FormControl>
                      <CardContent>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col gap-y-2"
                        >
                          {singleField.options?.map((option, index) => (
                            <FormItem
                              key={index}
                              className="flex items-center gap-x-2 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className={cn('my-0')}>
                                {option}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </FormControl>
                    {fieldState.error && (
                      <CardFooter>
                        <FormMessage />
                      </CardFooter>
                    )}
                  </FormItem>
                )}
              />
            ) : singleField.type === 'checkbox' ? (
              <FormField
                control={formHook.control}
                name={singleField._id}
                render={({ field, fieldState }) => (
                  <FormItem className={cn('space-y-0')}>
                    <CardHeader>
                      <FormLabel
                        className={cn(
                          'text-xl font-bold first-letter:capitalize'
                        )}
                      >
                        {singleField.label}
                        {singleField.required && (
                          <FaStarOfLife className="ml-1 inline-block h-3 w-3 align-top text-red-400" />
                        )}
                      </FormLabel>
                    </CardHeader>
                    <FormControl>
                      <CardContent className={cn('space-y-2')}>
                        {singleField.options?.map((option, index) => (
                          <FormItem
                            key={index}
                            className="flex items-center gap-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                value={option}
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (
                                    !field.value ||
                                    !Array.isArray(field.value)
                                  ) {
                                    return field.onChange([option]);
                                  }
                                  return checked
                                    ? field.onChange([...field.value, option])
                                    : field.onChange(
                                        field.value?.filter(
                                          (item: string) => item !== option
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel>{option}</FormLabel>
                          </FormItem>
                        ))}
                      </CardContent>
                    </FormControl>
                    {fieldState.error && (
                      <CardFooter>
                        <FormMessage />
                      </CardFooter>
                    )}
                  </FormItem>
                )}
              />
            ) : singleField.type === 'text' ||
              singleField.type === 'email' ||
              singleField.type === 'number' ? (
              <FormField
                control={formHook.control}
                name={singleField._id}
                render={({ field, fieldState }) => (
                  <FormItem className={cn('space-y-0')}>
                    <CardHeader>
                      <FormLabel
                        className={cn(
                          'text-xl font-bold first-letter:capitalize'
                        )}
                      >
                        {singleField.label}
                        {singleField.required && (
                          <FaStarOfLife className="ml-1 inline-block h-3 w-3 align-top text-red-400" />
                        )}
                      </FormLabel>
                    </CardHeader>
                    <FormControl>
                      <CardContent>
                        <Input
                          placeholder={`I.e. ${
                            singleField.type === 'email'
                              ? 'example.domain.com'
                              : singleField.type == 'number'
                                ? '1234'
                                : 'John Doe'
                          }`}
                          type={singleField.type}
                          {...field}
                        />
                      </CardContent>
                    </FormControl>
                    {fieldState.error && (
                      <CardFooter>
                        <FormMessage />
                      </CardFooter>
                    )}
                  </FormItem>
                )}
              />
            ) : singleField.type === 'date' ? (
              <FormField
                control={formHook.control}
                name={singleField._id}
                render={({ field, fieldState }) => (
                  <FormItem className={cn('space-y-0')}>
                    <CardHeader>
                      <FormLabel
                        className={cn(
                          'text-xl font-bold first-letter:capitalize'
                        )}
                      >
                        {singleField.label}
                        {singleField.required && (
                          <FaStarOfLife className="ml-1 inline-block h-3 w-3 align-top text-red-400" />
                        )}
                      </FormLabel>
                    </CardHeader>
                    <FormControl>
                      <CardContent>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </CardContent>
                    </FormControl>
                    {fieldState.error && (
                      <CardFooter>
                        <FormMessage />
                      </CardFooter>
                    )}
                  </FormItem>
                )}
              />
            ) : singleField.type === 'dropdown' ? (
              <FormField
                control={formHook.control}
                name={singleField._id}
                render={({ field, fieldState }) => (
                  <FormItem className={cn('space-y-0')}>
                    <CardHeader>
                      <FormLabel
                        className={cn(
                          'text-xl font-bold first-letter:capitalize'
                        )}
                      >
                        {singleField.label}
                        {singleField.required && (
                          <FaStarOfLife className="ml-1 inline-block h-3 w-3 align-top text-red-400" />
                        )}
                      </FormLabel>
                    </CardHeader>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <CardContent>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {singleField.options?.map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </CardContent>
                      </FormControl>
                    </Select>
                    {fieldState.error && (
                      <CardFooter>
                        <FormMessage />
                      </CardFooter>
                    )}
                  </FormItem>
                )}
              />
            ) : null}
          </Card>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default DisplayFields;
