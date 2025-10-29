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
import { PlusCircle } from "lucide-react";

const StatusesPage = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Statuses</CardTitle>
            <CardDescription>Manage the statuses master data.</CardDescription>
          </div>
          <Button size="sm" className="h-8 gap-1">
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
            {/* TODO: Add logic to fetch and display statuses */}
            <TableRow>
              <TableCell>Open</TableCell>
              <TableCell>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#FF0000" }}
                />
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="destructive" className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StatusesPage;
