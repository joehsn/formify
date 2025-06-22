import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { handleDeleteForm } from '@/lib/handlers';
import { Trash as TrashIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormType } from '@/types';

interface Props {
  _id: string;
  title: string;
  setForms: Dispatch<SetStateAction<FormType[]>>;
}

function DeleteDailog({ _id, title, setForms }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
          <TrashIcon size={32} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Delete "{title}" form?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this form? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteForm(_id);
              setForms((prev) => prev.filter((form) => form._id !== _id));
              setIsOpen(false);
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDailog;
