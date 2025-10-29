import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase";
import { toast } from "sonner";

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*, statuses(*), applications(*), profiles(*)")
        .eq("id", id)
        .single();
      if (error) {
        toast.error("Error fetching ticket details");
      } else {
        setTicket(data);
        setSelectedStatus(data.statuses.id);
      }
    };

    const fetchStatuses = async () => {
      const { data, error } = await supabase.from("statuses").select("*");
      if (error) {
        toast.error("Error fetching statuses");
      } else {
        setStatuses(data);
      }
    };

    fetchTicket();
    fetchStatuses();
  }, [id]);

  const handleStatusChange = async () => {
    if (selectedStatus) {
      const { error } = await supabase
        .from("tickets")
        .update({ status_id: selectedStatus })
        .eq("id", id);
      if (error) {
        toast.error("Error updating status");
      } else {
        toast.success("Status updated successfully");
        navigate("/admin");
      }
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              Viewing details for ticket {ticket.kode_tiket}
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg">Requester Information</h3>
            <Separator className="my-2" />
            <p>
              <strong>Name:</strong> {ticket.nama_penanya}
            </p>
            <p>
              <strong>Agency:</strong> {ticket.asal_instansi}
            </p>
            <p>
              <strong>Contact:</strong> {ticket.no_kontak}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Ticket Information</h3>
            <Separator className="my-2" />
            <p>
              <strong>Application:</strong> {ticket.applications.nama_aplikasi}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge style={{ backgroundColor: ticket.statuses.warna }}>
                {ticket.statuses.nama_status}
              </Badge>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(ticket.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-semibold text-lg">Problem Description</h3>
          <Separator className="my-2" />
          <p>{ticket.detail_masalah}</p>
        </div>
        <div className="mt-8">
          <h3 className="font-semibold text-lg">Update Status</h3>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <Select
              value={selectedStatus || ""}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.nama_status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleStatusChange}>Update</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDetailsPage;
