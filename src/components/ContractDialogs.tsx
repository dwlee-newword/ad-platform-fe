'use client';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { COMMON, CONTRACT_FORM, CONTRACT_FORM_MESSAGES, CONTRACT_RESULT } from '@/constants/text';

interface TodayWarningDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TodayWarningDialog({ open, onCancel, onConfirm }: TodayWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTRACT_FORM.todayWarning.title}</DialogTitle>
          <DialogDescription>{CONTRACT_FORM.todayWarning.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {CONTRACT_FORM.todayWarning.cancel}
          </Button>
          <Button onClick={onConfirm}>{CONTRACT_FORM.todayWarning.confirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, submitting, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!submitting && !o) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTRACT_FORM.confirm.title}</DialogTitle>
          <DialogDescription>{CONTRACT_FORM.confirm.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            {CONTRACT_FORM.confirm.cancel}
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? COMMON.loading : CONTRACT_FORM.confirm.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SuccessDialogProps {
  open: boolean;
  companyName: string;
  startDate: string;
  onClose: () => void;
}

export function SuccessDialog({ open, companyName, startDate, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTRACT_FORM.successModal.title}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>{CONTRACT_FORM_MESSAGES.successContractCreated(companyName)}</p>
              <p>{CONTRACT_FORM_MESSAGES.successAdScheduled(startDate)}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>{CONTRACT_FORM.successModal.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ErrorDialogProps {
  open: boolean;
  title: string;
  message: string | null;
  onClose: () => void;
}

export function ErrorDialog({ open, title, message, onClose }: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>{COMMON.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CancelContractDialogProps {
  open: boolean;
  cancelling: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CancelContractDialog({
  open,
  cancelling,
  onCancel,
  onConfirm,
}: CancelContractDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!cancelling && !o) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTRACT_RESULT.cancelDialog.title}</DialogTitle>
          <DialogDescription>{CONTRACT_RESULT.cancelDialog.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={cancelling}>
            {CONTRACT_RESULT.cancelDialog.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={cancelling}>
            {cancelling ? COMMON.loading : CONTRACT_RESULT.cancelDialog.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

