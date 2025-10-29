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
  DialogTrigger,
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

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nama_aplikasi: "",
    url: "",
  });

  const fetchApplications = async () => {
    const { data, error } = await supabase.from("applications").select("*");
    if (error) {
      toast.error("Error fetching applications");
    } else {
      setApplications(data);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ id: "", nama_aplikasi: "", url: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (app: any) => {
    setIsEditing(true);
    setFormData(app);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const { error } = await supabase
        .from("applications")
        .update({
          nama_aplikasi: formData.nama_aplikasi,
          url: formData.url,
        })
        .eq("id", formData.id);

      if (error) {
        toast.error("Error updating application");
      } else {
        toast.success("Application updated successfully");
      }
    } else {
      const { error } = await supabase
        .from("applications")
        .insert([{ nama_aplikasi: formData.nama_aplikasi, url: formData.url }]);

      if (error) {
        toast.error("Error adding application");
      } else {
        toast.success("Application added successfully");
      }
    }
    fetchApplications();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting application");
    } else {
      toast.success("Application deleted successfully");
    }
    fetchApplications();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Manage the applications master data.
            </CardDescription>
          </div>
          <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Application
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.nama_aplikasi}</TableCell>
                <TableCell>
                  <a href={app.url} target="_blank" rel="noopener noreferrer">
                    {app.url}
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(app)}
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
                          Are you sure you want to delete this application?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(app.id)}>
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
              {isEditing ? "Edit Application" : "Add Application"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nama_aplikasi">Application Name</Label>
              <Input
                id="nama_aplikasi"
                value={formData.nama_aplikasi}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
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

export default ApplicationsPage;
