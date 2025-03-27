
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  Laptop,
  Moon,
  Sun,
  LogOut,
  Save,
  Camera,
  Scale,
  Weight,
  Ruler,
  BarChart,
  Shield,
  Download,
  Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [bio, setBio] = useState("Fitness enthusiast passionate about strength training.");
  const [units, setUnits] = useState("metric");
  const [showMetrics, setShowMetrics] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWeight, setShowWeight] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showPersonalRecords, setShowPersonalRecords] = useState(true);
  const [notifyWorkouts, setNotifyWorkouts] = useState(true);
  const [notifyPrs, setNotifyPrs] = useState(true);
  
  const { toast } = useToast();
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved."
    });
  };
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your app preferences have been saved."
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved."
    });
  };
  
  const handleUploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data is being prepared for download."
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="border-none shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-border">
                    <AvatarImage src={avatar || ''} alt={name} />
                    <AvatarFallback className="text-xl">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-white" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      onChange={handleUploadAvatar}
                    />
                  </label>
                </div>
                
                <h2 className="text-xl font-semibold mt-4">{name}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
                <div className="mt-6 w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {showMetrics && (
            <Card className="border-none shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Body Metrics</CardTitle>
                <CardDescription>Your current body measurements</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <span>Weight</span>
                    </div>
                    <span>85 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span>Height</span>
                    </div>
                    <span>180 cm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span>Body Fat</span>
                    </div>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
        
        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" /> Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Privacy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself and your fitness journey"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-metrics"
                        checked={showMetrics}
                        onCheckedChange={setShowMetrics}
                      />
                      <Label htmlFor="show-metrics" className="cursor-pointer">Show body metrics</Label>
                    </div>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize how the app works for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Units of Measurement</h3>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue placeholder="Select units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Appearance</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          id="dark-mode"
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dashboard Display</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-weight">Show weight progress</Label>
                        <Switch
                          id="show-weight"
                          checked={showWeight}
                          onCheckedChange={setShowWeight}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-volume">Show volume lifted</Label>
                        <Switch
                          id="show-volume"
                          checked={showVolume}
                          onCheckedChange={setShowVolume}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-prs">Show personal records</Label>
                        <Switch
                          id="show-prs"
                          checked={showPersonalRecords}
                          onCheckedChange={setShowPersonalRecords}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSavePreferences}>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-workouts" className="block mb-1">Workout Reminders</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about upcoming workouts</p>
                      </div>
                      <Switch
                        id="notify-workouts"
                        checked={notifyWorkouts}
                        onCheckedChange={setNotifyWorkouts}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-prs" className="block mb-1">Personal Records</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you achieve a new personal record</p>
                      </div>
                      <Switch
                        id="notify-prs"
                        checked={notifyPrs}
                        onCheckedChange={setNotifyPrs}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between opacity-60 cursor-not-allowed">
                      <div>
                        <Label htmlFor="notify-insights" className="block mb-1">Weekly Insights</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly summaries of your progress</p>
                      </div>
                      <Switch id="notify-insights" disabled />
                    </div>
                    
                    <div className="flex items-center justify-between opacity-60 cursor-not-allowed">
                      <div>
                        <Label htmlFor="notify-friends" className="block mb-1">Friend Activity</Label>
                        <p className="text-sm text-muted-foreground">Get notified about your friends' workouts</p>
                      </div>
                      <Switch id="notify-friends" disabled />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your account security and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center gap-2 justify-center">
                        <Lock className="h-4 w-4" /> Change Password
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 justify-center">
                        <Shield className="h-4 w-4" /> Two-Factor Authentication
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Your Data</h3>
                    <div className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-1">Export Your Data</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Download a copy of all your workout data, progress statistics, and account information.
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                          <Download className="h-4 w-4" /> Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-destructive/20 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-destructive mb-1">Delete Account</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
