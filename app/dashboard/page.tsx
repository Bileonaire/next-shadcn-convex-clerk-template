import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FolderOpen, TrendingUp } from "lucide-react";

export default function Page() {
  return (
    <>
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your projects and activities in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Project completed</p>
                <p className="text-xs text-muted-foreground">
                  Project Alpha has been successfully completed
                </p>
              </div>
              <Badge variant="secondary">2 hours ago</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New task created</p>
                <p className="text-xs text-muted-foreground">
                  Task added to Project Beta
                </p>
              </div>
              <Badge variant="secondary">4 hours ago</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Project update</p>
                <p className="text-xs text-muted-foreground">
                  Project Beta reached 75% completion
                </p>
              </div>
              <Badge variant="secondary">1 day ago</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New project started</p>
                <p className="text-xs text-muted-foreground">
                  Project Gamma has been initialized
                </p>
              </div>
              <Badge variant="secondary">2 days ago</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-muted rounded-lg transition-colors">
              <FolderOpen className="h-5 w-5" />
              <div>
                <p className="font-medium">Create Project</p>
                <p className="text-sm text-muted-foreground">
                  Start a new project
                </p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-muted rounded-lg transition-colors">
              <Calendar className="h-5 w-5" />
              <div>
                <p className="font-medium">Add Task</p>
                <p className="text-sm text-muted-foreground">
                  Create a new task
                </p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-muted rounded-lg transition-colors">
              <TrendingUp className="h-5 w-5" />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Check performance metrics
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
