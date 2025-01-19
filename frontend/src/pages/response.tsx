import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUserStore from '@/lib/stores/user.store';
import { cn, envVars, fetcher } from '@/lib/utils';
import { FieldType, FormType, ResponseType } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { validate as isUUID } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FaCheck } from 'react-icons/fa6';

function ResponsePage() {
  const { formId, responseId } = useParams();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <h1>Not authenticated</h1>;
  }

  if (!formId || !responseId || !isUUID(formId) || !isUUID(responseId)) {
    return <h1>Response not found</h1>;
  }

  return <Response formId={formId} responseId={responseId} />;
}

interface ResponseProps {
  formId: string;
  responseId: string;
}

function Response({ formId, responseId }: ResponseProps) {
  const response = useSWR<ResponseType>(
    `${envVars.VITE_API_URL}/responses/${formId}/${responseId}`,
    fetcher
  );

  const form = useSWR<FormType>(
    `${envVars.VITE_API_URL}/forms/${formId}`,
    fetcher
  );

  const isLoading = response.isLoading || form.isLoading;
  const error = response.error || form.error;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error...</h1>;
  }

  return (
    <div className="mx-auto max-w-screen-md py-8">
      <div className="space-y-4">
        <Card className="z-10 border-t-8">
          <CardHeader>
            <div className="text-2xl font-bold text-slate-900">
              {form.data?.title}
            </div>
            <div className="text-lg">
              A response by{' '}
              <a
                href={`mailto:${response.data?.email}`}
                className="font-bold hover:underline"
              >
                {response.data?.email}
              </a>
              {/* TODO: Copy email button */}
            </div>
            <div>
              <p className="text-sm text-neutral-500">
                {format(new Date(response.data?.createdAt ?? new Date()), 'PPPppp')}
              </p>
            </div>
          </CardHeader>
        </Card>
        <ResponseFields
          fields={form.data?.fields ?? []}
          answers={response.data?.answers ?? {}}
        />
      </div>
    </div>
  );
}

interface ResponseFieldsProps {
  fields: FieldType[];
  answers: Record<string, string | string[]>;
}
function ResponseFields({ fields, answers }: ResponseFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <Card key={field._id}>
          <CardHeader>
            <div className="text-lg font-bold">{field.label}</div>
          </CardHeader>
          <CardContent>
            {field.type === 'text' ||
            field.type === 'email' ||
            field.type === 'number' ? (
              <Input
                type={field.type}
                value={
                  (answers[field._id] as string) ? answers[field._id] : 'N/A'
                }
                disabled
              />
            ) : field.type === 'radio' ? (
              <RadioGroup defaultValue={answers[field._id] as string} disabled>
                {field.options?.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option + idx} />
                    <Label htmlFor={option + idx}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : field.type === 'checkbox' ? (
              <div className="grid gap-2">
                {field.options?.map((option, idx) => (
                  <div
                    key={option + idx}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option + idx}
                      checked={(answers[field._id] as string[]).includes(
                        option
                      )}
                      disabled
                    />
                    <Label htmlFor={option + idx}>{option}</Label>
                  </div>
                ))}
              </div>
            ) : field.type === 'dropdown' ? (
              <>
                <Select value={answers[field._id] as string} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={answers[field._id] as string}>
                      {answers[field._id] as string}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Card
                  className={cn(
                    'mt-2 rounded-md border-input text-neutral-400 shadow-sm'
                  )}
                >
                  <CardContent className={cn('px-2 py-3')}>
                    {field.options?.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2 py-2 first-of-type:rounded-t-md last-of-type:rounded-b-md hover:bg-neutral-100"
                      >
                        {option}
                        {answers[field._id] === option && <FaCheck size={18} />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : field.type === 'date' ? (
              <Input type="text" value={answers[field._id]} disabled />
            ) : null}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default ResponsePage;
