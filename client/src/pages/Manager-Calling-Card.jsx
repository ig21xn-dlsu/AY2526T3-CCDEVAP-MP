// pages/ManagerCallingCard.jsx
import { useForm, useFieldArray } from 'react-hook-form'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import Navbar from '../components/Manager-Navbar.jsx'

function ManagerCallingCard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const API_URL = import.meta.env.VITE_API_URL;

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      phone: "",
      email: "",
      links: [{ label: "", url: "" }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links"
  });

  // Load existing calling card, if any, to switch into edit mode
  useEffect(() => {
    const fetchCard = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_URL}/api/calling-card/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        if (response.status === 404) {
          // no card yet — stay in create mode
          setIsEditMode(false);
          return;
        }

        const data = await response.json();

        setIsEditMode(true);
        reset({
          phone: data.phone || "",
          email: data.email || "",
          links: data.links?.length ? data.links : [{ label: "", url: "" }],
        });
      } catch (err) {
        console.error("Failed to load calling card:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [user, API_URL, reset]);

  const onSubmit = async (formData) => {
    setSubmitStatus(null);
    try {
      const payload = {
        ...formData,
        links: formData.links.filter((l) => l.label.trim() && l.url.trim()), // drop empty rows
      };

      const response = await fetch(`${API_URL}/api/calling-card`, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save calling card");

      setSubmitStatus('success');
      setIsEditMode(true);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container-fluid w-100">
      <Navbar />
      <div className="main-content d-flex flex-column p-5 gap-4 align-items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="container-fluid d-flex flex-column gap-4" style={{ maxWidth: '700px' }}>
          <div className="d-flex flex-column calloutTitle justify-content-center align-items-center">
            <h1>{isEditMode ? 'Edit Your Calling Card' : 'Set Up Your Calling Card'}</h1>
            <p>This is how roomies will reach out to you</p>
          </div>

          <div className="card shadow container p-5 d-flex flex-column gap-3">
            <div>
              <p className="mb-1">Phone Number</p>
              <input
                {...register("phone", { required: "Phone number is required" })}
                type="text"
                className="form-control border p-2"
                placeholder="09171234567"
              />
              {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
            </div>

            <div>
              <p className="mb-1">Email</p>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address"
                  }
                })}
                type="email"
                className="form-control border p-2"
                placeholder="you@email.com"
              />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </div>
          </div>

          <div className="card shadow container p-5 d-flex flex-column gap-3">
            <div className="d-flex flex-row justify-content-between align-items-center border-bottom pb-2">
              <h4 className="mb-0">External Links</h4>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => append({ label: "", url: "" })}
              >
                + Add Link
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="d-flex flex-row gap-2 align-items-start">
                <div className="flex-fill">
                  <input
                    {...register(`links.${index}.label`)}
                    type="text"
                    className="form-control border p-2"
                    placeholder="Label (e.g. Instagram)"
                  />
                </div>
                <div className="flex-fill">
                  <input
                    {...register(`links.${index}.url`)}
                    type="text"
                    className="form-control border p-2"
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {submitStatus === 'success' && (
            <p className="text-success">Calling card saved successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-danger">Something went wrong. Please try again.</p>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Calling Card'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManagerCallingCard
