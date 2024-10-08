"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";


type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {



  const { onOpen } = useOpenAccount();



  return (
    <>
  
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem  onClick={() => onOpen(id)}>
            <Edit className="size-5 mr-2"/>
            Edit
          </DropdownMenuItem>
        
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};