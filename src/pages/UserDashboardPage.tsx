import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { useSession } from "@/context/SessionContext";
import { Badge } from "@/components/ui/badge";

const UserDashboardPage = () => {
  const { user } = useSession();
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("tickets")
          .select("*, statuses(*), applications(*)")
          .eq("created_by", user.id);
        if (error) {
          console.error("Error fetching tickets:", error);
        } else {
          setTickets(data);
        }
      }
    };

    fetchTickets();
  }, [user]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <Button asChild>
          <Link to="/create-ticket">Create New Ticket</Link>
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>
            Here is a list of your most recent tickets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.kode_tiket}</TableCell>
                  <TableCell>{ticket.detail_masalah}</TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: ticket.statuses.warna }}>
                      {ticket.statuses.nama_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboardPage;
