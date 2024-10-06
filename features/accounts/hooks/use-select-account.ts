import { useRef, useState } from 'react';

import { userGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/select';

export const useSelectAccount = (): [() => JSX.Element, () => Promise<string | undefined>] => {
  const accountQuery = userGetAccounts();
  const accountMutation = useCreateAccount();

  // Handle account creation
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });

  // Map the account data to Select options
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  // Manage the promise for confirmation
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
    reject?: (reason?: any) => void;
  } | null>(null);

  // Create a function to initiate the selection dialog
  const confirm = () => new Promise<string | undefined>((resolve) => {
    setPromise({ resolve });
  });

  const selectValue = useRef<string | null>(null);

  // Handle closing the dialog
  const handleClose = () => {
    setPromise(null);
  };

  // Handle confirmation of the selected value
  const handleConfirm = () => {
    promise?.resolve(selectValue.current ?? undefined); // Resolve with the selected value or undefined
    handleClose();
  };

  // Handle cancellation
  const handleCancel = () => {
    promise?.resolve(undefined); // Resolve with undefined when canceled
    handleClose();
  };

  // The AccountDialog component
  const AccountDialog = () => (
    <Dialog open={promise !== null} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>Please select an account to continue.</DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => selectValue.current = value}
          disabled={accountQuery.isLoading || accountMutation.isLoading} // Correct loading states
        />
        <DialogFooter className="pt-2">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [AccountDialog, confirm];
};
