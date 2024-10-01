import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import {
    Dialog , 
    DialogContent ,
    DialogDescription,
    DialogFooter,
    DialogHeader ,
    DialogTitle
}  from "@/components/ui/dialog"
import { Select } from "@/components/select";
import { userGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-accounts";

export const useSelectAccount = () : [()=> JSX.Element , ()=> Promise<unknown>] => {

  const accountQuery = userGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name,
  });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));


    const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);

    const confirm = ()=> new Promise ((resolve , reject)=> {
        setPromise({resolve})
    }) 

    const handleClose = ()=>{
        setPromise(null)
    }

    const handleConfirm = ()=>{
        promise?.resolve(selectValue.current)
        handleClose()
    }

    const handleCancel = ()=>{
        promise?.resolve(undefined)
        handleClose()
    }

    const selectValue = useRef<string>();

    const AccountDialog = () => (
        <Dialog open={promise !== null}>
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
              disabled={accountQuery.isLoading || accountMutation.isPending}
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
                onClick={handleConfirm}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      return [AccountDialog, confirm];


}