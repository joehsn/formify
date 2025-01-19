import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

function FAB() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create/' + uuidv4());
  };
  return (
    <Button
      onClick={handleClick}
      variant="default"
      size="lg"
      className="fixed bottom-8 right-4 p-4 shadow-simple md:right-8"
    >
      <FaPlus size={24} />
      <span className="ml-2 hidden sm:inline">New Form</span>
    </Button>
  );
}

export default FAB;
