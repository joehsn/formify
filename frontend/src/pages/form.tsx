import Option from '@/components/Option';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useUpdateFormStore from '@/lib/stores/update.store';
import useUserStore from '@/lib/stores/user.store';
import { cn, envVars, fetcher } from '@/lib/utils';
import { FieldType, FormType } from '@/types';
import { useEffect, useRef } from 'react';
import {
  ChevronUp as ChevronUpIcon,
  Save as SaveIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { validate as isUUID } from 'uuid';
import PageNotFound from './A404';
import Login from './login';
import { handleUpdateForm } from '@/lib/handlers';
import FAB from '@/components/FAB';
import Loader from '@/components/Loader';
import Error from '@/components/Error';

function FormPage() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = ref.current;
    const handleScroll = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (button) {
      button.addEventListener('click', handleScroll);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleScroll);
      }
    };
  }, []);

  const { formId } = useParams();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!formId || !isUUID(formId)) {
    return <PageNotFound />;
  }

  return (
    <>
      <UpdateForm formId={formId} />
      <FAB ref={ref} aria-label="Scroll to top">
        <ChevronUpIcon size={32} />
        <span className="sr-only">Scroll to top</span>
      </FAB>
    </>
  );
}

function UpdateForm({ formId }: { formId: string }) {
  const { data, error, isLoading } = useSWR(
    `${envVars.VITE_API_URL}/forms/${formId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const form = useUpdateFormStore((state) => state.form);
  const setForm = useUpdateFormStore((state) => state.setForm);
  const setFormTitle = useUpdateFormStore((state) => state.setFormTitle);
  const setFormDescription = useUpdateFormStore(
    (state) => state.setFormDescription
  );
  const setFormStatus = useUpdateFormStore((state) => state.setFormStatus);
  const addFormField = useUpdateFormStore((state) => state.addFormField);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data, setForm]);

  if (isLoading && !data) {
    return <Loader />;
  }

  if (!form) {
    return <PageNotFound />;
  }

  if (error) {
    return <Error />;
  }
  return (
    <div className="relative mx-auto w-full max-w-screen-md space-y-6 px-4 py-8">
      <Card className="z-10 border-t-8">
        <CardHeader>
          <input
            type="text"
            className="border-b py-2 text-2xl font-bold outline-none focus:border-neutral-900"
            value={form.formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onFocus={(e) => {
              if (e.target.value === 'Untitled Form') {
                setFormTitle('');
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setFormTitle('Untitled Form');
              }
            }}
            aria-label="Form title"
          />
          <textarea
            className="h-40 resize-none border-b py-2 text-lg font-normal outline-none focus:border-neutral-900"
            value={form.formDesc}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form description"
            aria-label="Form description"
          />
        </CardHeader>
        <CardFooter className={cn('space-x-4')}>
          <Button
            aria-label="Save form"
            className="w-full"
            onClick={() => handleUpdateForm(form)}
          >
            <SaveIcon size={32} />
            <span>Update Form</span>
          </Button>
          <Select
            defaultValue={form.formStatus}
            onValueChange={(newStatus: FormType['formStatus']) =>
              setFormStatus(newStatus)
            }
          >
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['draft', 'published', 'closed'].map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
      <Fields />
      <Button
        aira-label="Add new field"
        className="w-full"
        onClick={() => addFormField()}
      >
        <PlusIcon size={32} />
        <span>New Field</span>
      </Button>
    </div>
  );
}

function Fields() {
  const lastFieldRef = useRef<HTMLDivElement>(null);
  const form = useUpdateFormStore((state) => state.form);
  const setFieldLabel = useUpdateFormStore((state) => state.setFieldLabel);
  const setFieldType = useUpdateFormStore((state) => state.setFieldType);
  const setFieldRequired = useUpdateFormStore(
    (state) => state.setFieldRequired
  );
  const removeField = useUpdateFormStore((state) => state.removeFormField);
  const setFieldOption = useUpdateFormStore((state) => state.setFieldOption);
  const addFieldOption = useUpdateFormStore((state) => state.addFieldOption);
  const removeFieldOption = useUpdateFormStore(
    (state) => state.removeFieldOption
  );
  const types = [
    'text',
    'email',
    'number',
    'radio',
    'checkbox',
    'dropdown',
    'date',
  ];

  useEffect(() => {
    if (lastFieldRef.current) {
      lastFieldRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [form?.formFields.length]);

  return (
    <>
      {form?.formFields.map((field) => (
        <Card
          aria-label="Field"
          key={field._id}
          ref={
            form.formFields[form.formFields.length - 1]._id === field._id
              ? lastFieldRef
              : undefined
          }
        >
          <CardHeader
            className={cn('flex flex-row items-center justify-between gap-4')}
          >
            <input
              type="text"
              value={field.fieldLabel}
              aria-label="Field label"
              className="w-full border-b py-1 text-lg font-bold outline-none focus:border-neutral-900"
              onChange={(e) => {
                setFieldLabel(field._id, e.target.value);
              }}
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
              defaultValue={field.fieldType}
              onValueChange={(newType: FieldType['fieldType']) => {
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
              {['text', 'number', 'email'].includes(field.fieldType) ? (
                <Input
                  placeholder={`I.e. ${
                    field.fieldType === 'text'
                      ? 'Lorem Ipsum...'
                      : field.fieldType === 'number'
                        ? '123456789'
                        : 'example@domain.com'
                  }`}
                  disabled
                />
              ) : ['radio', 'checkbox', 'dropdown'].includes(
                  field.fieldType
                ) ? (
                <>
                  {field.fieldOptions?.map((option, index) => (
                    <Option
                      key={index}
                      option={option}
                      index={index}
                      fieldType={
                        field.fieldType as 'radio' | 'checkbox' | 'dropdown'
                      }
                      optionsLength={
                        field.fieldOptions ? field.fieldOptions.length : 2
                      }
                      onOptionChange={(newOption) => {
                        setFieldOption(field._id, index, newOption);
                      }}
                      onOptionDelete={() => removeFieldOption(field._id, index)}
                    />
                  ))}
                  <Button
                    aria-label="Add new option"
                    variant="outline"
                    onClick={() => addFieldOption(field._id)}
                  >
                    <PlusIcon size={32} />
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
                checked={field.fieldRequired}
                onCheckedChange={(checked) => {
                  setFieldRequired(field._id, checked);
                }}
              />
              <Label htmlFor={field._id + '-required-switch'}>Required</Label>
            </div>
            <div>
              <Button
                variant="destructive"
                disabled={form.formFields.length === 1}
                onClick={() => {
                  removeField(field._id);
                }}
              >
                <TrashIcon size={24} />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default FormPage;
