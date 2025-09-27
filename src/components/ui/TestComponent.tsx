import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * TestComponent renders a button that opens a modal.
 * Inside the modal, it displays text and an Ok button that changes behavior on click.
 */
const TestComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('This works');
  const [buttonText, setButtonText] = useState('Ok');

  const handleOkClick = () => {
    if (buttonText === 'Ok') {
      setMessage('Are you sure?');
      setButtonText('Yes');
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={() => setIsOpen(true)} variant="default">Open Modal</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Modal</DialogTitle>
          <p className="mt-4">{message}</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleOkClick} variant="default">{buttonText}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestComponent;