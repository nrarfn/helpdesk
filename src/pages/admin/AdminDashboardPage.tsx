import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "@/supabase";

const AdminDashboardPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*, statuses(*), applications(*), profiles(*)");
      if (error) {
        console.error("Error fetching tickets:", error);
      } else {
        setTickets(data);
        setFilteredTickets(data);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.statuses.nama_status.toLowerCase() === statusFilter
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((ticket) =>
        ticket.kode_tiket.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [statusFilter, searchQuery, tickets]);

  return (
    <Tabs defaultValue="all" onValueChange={setStatusFilter}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <TabsContent value={statusFilter}>
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>
              A list of all tickets submitted by users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.kode_tiket}</TableCell>
                    <TableCell>{ticket.nama_penanya}</TableCell>
                    <TableCell>{ticket.applications.nama_aplikasi}</TableCell>
                    <TableCell>
                      <Badge
                        style={{ backgroundColor: ticket.statuses.warna }}
                      >
                        {ticket.statuses.nama_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" asChild>
                        <Link to={`/admin/tickets/${ticket.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboardPage;
