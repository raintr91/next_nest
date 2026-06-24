import type { Meta, StoryObj } from '@storybook/vue3'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert/index'
import { Badge } from '@/components/ui/badge/index'
import { Button } from '@/components/ui/button/index'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog/index'
import { Input } from '@/components/ui/input/index'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/index'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table/index'

const meta: Meta = {
  title: 'Shadcn UI/Basics',
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj

export const CommonStates: Story = {
  render: () => ({
    components: {
      Alert,
      AlertDescription,
      AlertTitle,
      Badge,
      Button,
      Card,
      CardContent,
      CardDescription,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      CardHeader,
      CardTitle,
      Input,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    },
    template: `
      <main class="space-y-8">
        <section class="space-y-3">
          <h2 class="text-lg font-semibold">Buttons</h2>
          <div class="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button class="bg-success text-success-foreground hover:bg-success/90">Success</Button>
            <Button class="bg-warning text-warning-foreground hover:bg-warning/90">Warning</Button>
            <Button class="bg-info text-info-foreground hover:bg-info/90">Info</Button>
            <Button class="bg-danger text-danger-foreground hover:bg-danger/90">Danger</Button>
          </div>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold">Badges</h2>
          <div class="flex flex-wrap gap-2">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge class="bg-success text-success-foreground">Success</Badge>
            <Badge class="bg-warning text-warning-foreground">Warning</Badge>
            <Badge class="bg-info text-info-foreground">Info</Badge>
            <Badge class="bg-danger text-danger-foreground">Danger</Badge>
          </div>
        </section>

        <section class="grid gap-4 md:grid-cols-2">
          <Alert class="border-info/40 bg-info/10 text-info">
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Common informational message state.</AlertDescription>
          </Alert>
          <Alert class="border-success/40 bg-success/10 text-success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Operation completed successfully.</AlertDescription>
          </Alert>
          <Alert class="border-warning/40 bg-warning/10 text-warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Check this before continuing.</AlertDescription>
          </Alert>
          <Alert class="border-danger/40 bg-danger/10 text-danger">
            <AlertTitle>Danger</AlertTitle>
            <AlertDescription>Something needs immediate attention.</AlertDescription>
          </Alert>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Form + Table</CardTitle>
            <CardDescription>Basic shadcn primitives used in portal screens.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-3 md:grid-cols-2">
              <Input placeholder="Search records..." />
              <Select default-value="active">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Portal Base</TableCell>
                  <TableCell><Badge class="bg-success text-success-foreground">Active</Badge></TableCell>
                  <TableCell>Dashboard</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Auth Flow</TableCell>
                  <TableCell><Badge class="bg-info text-info-foreground">Ready</Badge></TableCell>
                  <TableCell>Security</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold">Dialog</h2>
          <Dialog>
            <DialogTrigger as-child>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  Dialog primitives are shown with the required Dialog parent context.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

      </main>
    `
  })
}
