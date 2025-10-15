import { toast as sonnerToast } from "sonner";

const MAX_VISIBLE = 3;
const activeIds: string[] = [];

function pushId(id: string) {
  activeIds.push(id);
  if (activeIds.length > MAX_VISIBLE) {
    const oldest = activeIds.shift();
    if (oldest) {
      try {
        sonnerToast.dismiss(oldest);
      } catch (e) {
        // ignore
      }
    }
  }
}

export const toast = {
  loading: (message: string, opts?: any) => {
    const id = sonnerToast.loading(message, opts) as string;
    pushId(id);
    return id;
  },
  success: (message: string, opts?: any) => {
    const id = sonnerToast.success(message, opts) as string;
    pushId(id);
    return id;
  },
  error: (message: string, opts?: any) => {
    const id = sonnerToast.error(message, opts) as string;
    pushId(id);
    return id;
  },
  info: (message: string, opts?: any) => {
    const id = sonnerToast(message, { ...opts, type: "info" }) as string;
    pushId(id);
    return id;
  },
  warning: (message: string, opts?: any) => {
    const id = sonnerToast(message, { ...opts, type: "warning" }) as string;
    pushId(id);
    return id;
  },
  note: (message: string, opts?: any) => {
    const id = sonnerToast(message, opts) as string;
    pushId(id);
    return id;
  },
  dismiss: (id?: string) => {
    if (id) {
      const idx = activeIds.indexOf(id);
      if (idx !== -1) activeIds.splice(idx, 1);
    }
    return sonnerToast.dismiss(id as any);
  },
  // re-export raw sonner API for anything else
  raw: sonnerToast,
};

export default toast;
