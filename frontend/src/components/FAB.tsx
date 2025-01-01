import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

function FAB() {
  const navigate = useNavigate();
  const uuid = uuidv4();

  const handleClick = () => {
    navigate(`/form/${uuid}`);
  };
  return (
    <Button
      onClick={handleClick}
      variant="default"
      className="fixed bottom-8 right-4 md:right-8 shadow-simple rounded-full p-4"
    >
      <FaPlus size={24} />
      <span className="ml-2 hidden sm:inline">New Form</span>
    </Button>
  );
}

export default FAB;
