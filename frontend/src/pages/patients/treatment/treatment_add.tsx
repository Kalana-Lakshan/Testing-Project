import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { createTreatment, isServiceCodeTaken, type TreatmentCreateInput } from "@/services/treatmentServices";

const initial: TreatmentCreateInput = {
  service_code: "",
  name: "",
  fee: "",
  description: "",
  speciality_id: "",
};

const TreatmentAdd: React.FC = () => {
  const [form, setForm] = useState<TreatmentCreateInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingCode, setCheckingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // simple validators
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.service_code.trim()) e.service_code = "Service code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (form.fee === "" || Number.isNaN(Number(form.fee))) e.fee = "Valid fee is required";
    if (!form.speciality_id.trim()) e.speciality_id = "Speciality ID is required";
    return e;
  };

  const handleChange = (key: keyof TreatmentCreateInput) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = ev.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" })); // clear field error as user types
  };

  // Debounced uniqueness check for service_code
  const serviceCode = form.service_code.trim();
  const debouncedCode = useMemo(() => serviceCode, [serviceCode]);

  useEffect(() => {
    let alive = true;
    if (!debouncedCode) {
      setErrors((e) => ({ ...e, service_code: "" }));
      return;
    }
    (async () => {
      setCheckingCode(true);
      try {
        const taken = await isServiceCodeTaken(debouncedCode);
        if (!alive) return;
        setErrors((e) => ({ ...e, service_code: taken ? "This service code already exists" : "" }));
      } catch {
      } finally {
        if (alive) setCheckingCode(false);
      }
    })();
    return () => { alive = false; };
  }, [debouncedCode]);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (e.service_code || e.name || e.fee || e.speciality_id) {
      setErrors(e);
      return;
    }
    // final check before submit
    try {
      setIsSubmitting(true);
      const loadingId = toast.loading("Creating treatment...");
      const taken = await isServiceCodeTaken(form.service_code.trim());
      if (taken) {
        toast.dismiss(loadingId);
        setErrors((prev) => ({ ...prev, service_code: "This service code already exists" }));
        setIsSubmitting(false);
        return;
      }

      const payload = {
        service_code: form.service_code.trim(),
        name: form.name.trim(),
        fee: Number(form.fee), 
        description: form.description.trim(),
        speciality_id: form.speciality_id.trim(),
      };
      await createTreatment(payload);
      toast.dismiss(loadingId);
      toast.success("Treatment created");
      navigate("/patients/treatment", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Failed to create treatment");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Treatment</h1>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Service Code</label>
          <input
            type="text"
            value={form.service_code}
            onChange={handleChange("service_code")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="e.g., SC-001"
          />
          <p className="text-xs text-muted-foreground mt-1">{checkingCode ? "Checking..." : "Must be unique"}</p>
          {errors.service_code && <p className="text-xs text-red-600 mt-1">{errors.service_code}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="e.g., Physiotherapy"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Fee */}
        <div>
          <label className="block text-sm font-medium mb-1">Fee (Rs.)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={form.fee}
            onChange={handleChange("fee")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="e.g., 1500"
          />
          {errors.fee && <p className="text-xs text-red-600 mt-1">{errors.fee}</p>}
        </div>

        {/* Speciality ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Speciality ID</label>
          <input
            type="text"
            value={form.speciality_id}
            onChange={handleChange("speciality_id")}
            className="w-full rounded-md border px-3 py-2"
            placeholder="e.g., SP-12"
          />
          {errors.speciality_id && <p className="text-xs text-red-600 mt-1">{errors.speciality_id}</p>}
        </div>

        {/* Description (full width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            className="w-full rounded-md border px-3 py-2 min-h-[100px]"
            placeholder="Optional description"
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting || checkingCode}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setForm(initial)} disabled={isSubmitting}>
          Reset
        </Button>
      </div>
    </form>
  );
};

export default TreatmentAdd;
