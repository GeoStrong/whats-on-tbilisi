"use client";

import React from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  // Bell,
  // Globe,
  // Lock,
  // Mail,
  Palette,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import { Label } from "../ui/label";
// import { Separator } from "@radix-ui/react-dropdown-menu";
import useThemeSwitch from "@/lib/hooks/useThemeSwitch";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ProfilePreferences: React.FC = () => {
  const { theme, setTheme } = useThemeSwitch();
  return (
    <>
      <div className="space-y-4">
        {/* <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription className="text-base">
              Manage how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base" htmlFor="email-notif">
                    Email Notifications
                  </Label>
                </div>
                <p className="text-base text-muted-foreground">
                  Receive email updates about activities and activities.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base" htmlFor="activity-reminders">
                    Activity Reminders
                  </Label>
                </div>
                <p className="text-base text-muted-foreground">
                  Get reminders before your saved activities start.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base" htmlFor="newsletter">
                    Newsletter Subscription
                  </Label>
                </div>
                <p className="text-base text-muted-foreground">
                  Subscribe to our weekly newsletter with curated activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card className="border-none shadow-none hover:shadow-none dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="">Display Preferences</CardTitle>
            <CardDescription className="text-base">
              Customize your viewing experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-6 w-6 text-muted-foreground" />
                  <Label className="text-base">Theme</Label>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[140px] justify-start"
                    >
                      {theme === "system" ? (
                        <>
                          <Monitor className="mr-2 h-4 w-4" />
                          System
                        </>
                      ) : theme === "dark" ? (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark
                        </>
                      ) : (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={theme || "system"}
                      onValueChange={(value) =>
                        setTheme(value as "system" | "light" | "dark")
                      }
                    >
                      <DropdownMenuRadioItem value="system">
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="">Account Settings</CardTitle>
            <CardDescription className="text-base">
              Customize your viewing experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base">Password</Label>
              </div>
              <p className="mb-2 text-base text-muted-foreground">
                Keep your account secure by updating your password regularly.
              </p>
              <Button variant="outline" className="text-base">
                Change Password
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-base text-destructive">Danger Zone</Label>
              <p className="mb-2 text-base text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" className="text-base">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </>
  );
};
export default ProfilePreferences;
