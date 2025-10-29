import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { toast } from "sonner";
import { Eye, MessageSquare, Calendar, User, Building } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Ticket {
  id: string;
  ticket_code: string;
  title: string;
  description: string;
  status_id: string;
  application_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status?: {
    name: string;
  };
  application?: {
    name: string;
  };
  profile?: {
    email: string;
  };
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [applicationFilter, setApplicationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statuses, setStatuses] = useState<Array<{id: string, name: string}>>([]);
  const [applications, setApplications] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    fetchTickets();
    fetchStatuses();
    fetchApplications();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, applicationFilter, searchQuery]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          id,
          ticket_code,
          title,
          description,
          status_id,
          application_id,
          created_by,
          created_at,
          updated_at,
          status:statuses(name),
          application:applications(name),
          profile:profiles(email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Gagal memuat data tiket");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from("statuses")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status_id === statusFilter);
    }

    // Filter by application
    if (applicationFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.application_id === applicationFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.ticket_code.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.profile?.email.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case "open":
      case "baru":
        return "destructive";
      case "in progress":
      case "sedang diproses":
        return "default";
      case "resolved":
      case "selesai":
        return "secondary";
      case "closed":
      case "ditutup":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Semua Tiket</h1>
          <p className="text-muted-foreground">
            Kelola dan monitor semua tiket support
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filteredTickets.length} dari {tickets.length} tiket
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Cari tiket, kode, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={applicationFilter} onValueChange={setApplicationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter aplikasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Aplikasi</SelectItem>
            {applications.map((app) => (
              <SelectItem key={app.id} value={app.id}>
                {app.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Tiket</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aplikasi</TableHead>
              <TableHead>Dibuat oleh</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono font-medium">
                  {ticket.ticket_code}
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    <div className="font-medium truncate">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {ticket.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(ticket.status?.name || "")}>
                    {ticket.status?.name || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">
                      {ticket.application?.name || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">
                      {ticket.profile?.email || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(ticket.created_at)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/admin/tickets/${ticket.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/admin/tickets/${ticket.id}#comments`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTickets.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== "all" || applicationFilter !== "all"
              ? "Tidak ada tiket yang sesuai dengan filter"
              : "Belum ada tiket yang dibuat"
            }
          </p>
        </div>
      )}
    </div>
  );
}