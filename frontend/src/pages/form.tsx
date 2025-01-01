import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validate as isUUID } from 'uuid';
import A404 from './A404';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import useFormStore from '@/lib/stores/form.store';
import { Button } from '@/components/ui/button';
import { FaFloppyDisk, FaPlus } from 'react-icons/fa6';
import Fields from '@/components/Fields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormType } from '@/lib/schemas/form.schema';
import { cn } from '@/lib/utils';

function Form() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const form = useFormStore((state) => state.form);
  const setFormTitle = useFormStore((state) => state.setFormTitle);
  const setFormDescription = useFormStore((state) => state.setFormDescription);
  const addFormField = useFormStore((state) => state.addFormField);
  const setFormStatus = useFormStore((state) => state.setFormStatus);
  useEffect(() => {
    document.title = `${form.title} - Formify`;
  }, [form.title, navigate]);

  if (!isUUID(formId)) {
    return <A404 />;
  }

  return (
    <div className="relative mx-auto w-full max-w-screen-md space-y-6 px-4 py-8">
      <Card className="z-10 border-t-8">
        <CardHeader>
          <input
            type="text"
            className="border-b py-2 text-2xl font-bold outline-none focus:border-neutral-900"
            value={form.title}
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
          <input
            type="text"
            className="border-b py-2 text-lg font-normal outline-none focus:border-neutral-900"
            value={form.description}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form description"
            aria-label="Form description"
          />
        </CardHeader>
        <CardFooter className={cn('space-x-4')}>
          <Button
            aria-label="Save form"
            className="w-full"
            onClick={() => {
              console.log(form);
            }}
          >
            <FaFloppyDisk size={32} />
            <span>Save Form</span>
          </Button>
          <Select
            defaultValue={form.status}
            onValueChange={(newStatus: FormType['status']) =>
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
        onClick={() => {
          addFormField();
          console.log(form);
        }}
      >
        <FaPlus size={32} />
        <span>New Field</span>
      </Button>
    </div>
  );
}

export default Form;
