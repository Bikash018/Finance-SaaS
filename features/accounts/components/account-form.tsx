import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';


const AccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',

  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Implement save changes logic here
    console.log('Form data saved:', formData);
  };

  const handleDeleteAccount = () => {
    // Implement delete account logic here
    console.log('Account deletion triggered');
  };

  return (
    <form className=" flex flex-col gap-4">
      <div className='flex flex-col gap-4'>
        <div className=''> <label htmlFor="username" className="block text-sm font-medium p-2 mb-4">
          Account Name
        </label></div>

        <div><Input
          id="Account Name"
          name="username"
          value={formData.username}
        className={cn(
            "mt-1 block w-full outline-none border-none focus:outline-none focus:border-transparent focus:ring-0",
         
          )}
          onChange={handleInputChange}
         
          placeholder="Enter your username"
        /></div>
       
        
      </div>

   

      <div className="flex space-x-4 ">
        <Button  onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
