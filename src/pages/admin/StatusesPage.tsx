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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "@/supabase";
import { toast } from "sonner";

const StatusesPage = () => {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nama_status: "",
    warna: "",
    urutan: 0,
  });

  const fetchStatuses = async () => {
    const { data, error } = await supabase.from("statuses").select("*").order("urutan");
    if (error) {
      toast.error("Error fetching statuses");
    } else {
      setStatuses(data);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ id: "", nama_status: "", warna: "", urutan: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (status: any) => {
    setIsEditing(true);
    setFormData(status);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const { error } = await supabase
        .from("statuses")
        .update({
          nama_status: formData.nama_status,
          warna: formData.warna,
          urutan: formData.urutan,
        })
        .eq("id", formData.id);

      if (error) {
        toast.error("Error updating status");
      } else {
        toast.success("Status updated successfully");
      }
    } else {
      const { error } = await supabase.from("statuses").insert([
        {
          nama_status: formData.nama_status,
          warna: formData.warna,
          urutan: formData.urutan,
        },
      ]);

      if (error) {
        toast.error("Error adding status");
      } else {
        toast.success("Status added successfully");
      }
    }
    fetchStatuses();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("statuses").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting status");
    } else {
      toast.success("Status deleted successfully");
    }
    fetchStatuses();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Statuses</CardTitle>
            <CardDescription>Manage the statuses master data.</CardDescription>
          </div>
          <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Status
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map((status) => (
              <TableRow key={status.id}>
                <TableCell>{status.nama_status}</TableCell>
                <TableCell>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: status.warna }}
                  />
                </TableCell>
                <TableCell>{status.urutan}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(status)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this status?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(status.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Status" : "Add Status"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nama_status">Status Name</Label>
              <Input
                id="nama_status"
                value={formData.nama_status}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="warna">Color</Label>
              <Input
                id="warna"
                type="color"
                value={formData.warna}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="urutan">Order</Label>
              <Input
                id="urutan"
                type="number"
                value={formData.urutan}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">{isEditing ? "Update" : "Add"}</Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StatusesPage;
