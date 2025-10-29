import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
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
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const defaultRoles = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access with all permissions",
  },
  {
    id: "user",
    name: "User",
    description: "Standard user with limited permissions",
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Simulate loading default roles
    // In a real app, you would fetch from your roles table
    setTimeout(() => {
      const rolesWithTimestamps = defaultRoles.map(role => ({
        ...role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      setRoles(rolesWithTimestamps);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRole) {
        // Update existing role
        setRoles(prev => prev.map(role => 
          role.id === editingRole.id 
            ? {
                ...role,
                name: formData.name,
                description: formData.description,
                updated_at: new Date().toISOString(),
              }
            : role
        ));
        toast.success("Role berhasil diupdate");
      } else {
        // Create new role
        const newRole: Role = {
          id: formData.name.toLowerCase().replace(/\s+/g, '_'),
          name: formData.name,
          description: formData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setRoles(prev => [...prev, newRole]);
        toast.success("Role berhasil dibuat");
      }

      setDialogOpen(false);
      setEditingRole(null);
      setFormData({ name: "", description: "" });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (roleId: string) => {
    try {
      // Check if it's a default role
      if (roleId === 'admin' || roleId === 'user') {
        toast.error("Role default tidak dapat dihapus");
        return;
      }

      setRoles(prev => prev.filter(role => role.id !== roleId));
      toast.success("Role berhasil dihapus");
    } catch (error: any) {
      console.error("Error deleting role:", error);
      toast.error("Gagal menghapus role");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const openCreateDialog = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDefaultRole = (roleId: string) => {
    return roleId === 'admin' || roleId === 'user';
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
          <h1 className="text-3xl font-bold">Kelola Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? "Edit Role" : "Tambah Role Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingRole 
                    ? "Update informasi role"
                    : "Buat role baru dengan nama dan deskripsi"
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Role</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama role"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi role"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingRole ? "Update" : "Buat Role"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Diupdate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Badge variant={isDefaultRole(role.id) ? "default" : "secondary"}>
                    {isDefaultRole(role.id) ? "Default" : "Custom"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(role.created_at)}</TableCell>
                <TableCell>{formatDate(role.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(role)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {!isDefaultRole(role.id) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Role
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus role "{role.name}"? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(role.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {roles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Belum ada data roles</p>
        </div>
      )}
    </div>
  );
}