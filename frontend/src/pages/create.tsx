import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import useCreateFormStore from '@/lib/stores/create.store';
import { Button } from '@/components/ui/button';
import { Save as SaveIcon, Plus as PlusIcon } from 'lucide-react';
import CreateFields from '@/components/CreateFields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import useUserStore from '@/lib/stores/user.store';
import { FormType } from '@/types';
import { handleSaveForm } from '@/lib/handlers';
import Login from './login';
import { validate as isUUID } from 'uuid';
import DivInput from "@/components/DivInput"

function Create() {
  const { formId } = useParams();
  const lastFieldRef = useRef<HTMLDivElement>(null);
  const form = useCreateFormStore((state) => state.form);
  const setFormTitle = useCreateFormStore((state) => state.setFormTitle);
  const setFormDescription = useCreateFormStore(
    (state) => state.setFormDescription
  );
  const addFormField = useCreateFormStore((state) => state.addFormField);
  const setFormStatus = useCreateFormStore((state) => state.setFormStatus);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!formId || !isUUID(formId)) {
    return <h1>Form not found</h1>;
  }

  return (
    <div className="relative mx-auto w-full max-w-screen-md space-y-6 px-4 py-8">
      <Card className="z-10 border-t-8">
        <CardHeader>
          <DivInput
            value={form.title}
            setValue={setFormTitle}
            aria-label="Form title"
            className="border-b py-2 text-2xl font-bold outline-none focus:border-neutral-900"
          />
          <DivInput
            value={form.description ?? ""}
            setValue={setFormDescription}
            aria-label="Form description"
            className="border-b py-2 h-32 overflow-y-auto text-lg font-normal outline-none focus:border-neutral-900"
          />
        </CardHeader>
        <CardFooter className={cn('space-x-4')}>
          <Button
            aria-label="Save form"
            className="w-full"
            onClick={() => {
              handleSaveForm(formId, form as FormType);
            }}
          >
            <SaveIcon size={32} />
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
      <CreateFields ref={lastFieldRef} />
      <Button
        aira-label="Add new field"
        className="w-full"
        onClick={() => {
          addFormField();
          setTimeout(
            () =>
              lastFieldRef.current?.scrollIntoView({
                behavior: 'smooth',
              }),
            0
          );
        }}
      >
        <PlusIcon size={32} />
        <span>New Field</span>
      </Button>
    </div>
  );
}

export default Create;
