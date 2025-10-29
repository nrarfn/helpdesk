import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import supabase from "@/supabase";
import { useSession } from "@/context/SessionContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateTicketPage = () => {
  const { user } = useSession();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nama_penanya: "",
    asal_instansi: "",
    no_kontak: "",
    application_id: "",
    detail_masalah: "",
  });

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase.from("applications").select("*");
      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data);
      }
    };

    fetchApplications();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, application_id: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const { data: latestTicket } = await supabase
        .from("tickets")
        .select("kode_tiket")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const newTicketNumber = latestTicket
        ? parseInt(latestTicket.kode_tiket.slice(2)) + 1
        : 1;
      const newTicketId = `HD${newTicketNumber.toString().padStart(4, "0")}`;

      const { error } = await supabase.from("tickets").insert([
        {
          ...formData,
          created_by: user.id,
          kode_tiket: newTicketId,
          status_id: "a7e4b9f0-8c7c-4a3e-9b0f-2b0b7e4c6b8c", // default to 'Open' status
        },
      ]);

      if (error) {
        toast.error("Error creating ticket");
      } else {
        toast.success("Ticket created successfully");
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Ticket</CardTitle>
          <CardDescription>
            Please fill out the form below to submit a new ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nama_penanya">Full Name</Label>
                <Input
                  id="nama_penanya"
                  placeholder="Enter your full name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="asal_instansi">Agency</Label>
                <Input
                  id="asal_instansi"
                  placeholder="Enter your agency"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="no_kontak">Contact Number</Label>
              <Input
                id="no_kontak"
                placeholder="Enter your contact number"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="application_id">Application</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.nama_aplikasi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="detail_masalah">Problem Description</Label>
              <Textarea
                id="detail_masalah"
                placeholder="Describe your problem in detail"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">Submit Ticket</Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicketPage;
