"use client";

import React from "react";
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
  Languages,
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
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

const ProfilePreferences: React.FC = () => {
  const { theme, setTheme } = useThemeSwitch();
  const { t } = useTranslation(["settings"]);
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
            <CardTitle className="">{t("settings:display.title")}</CardTitle>
            <CardDescription className="text-base">
              {t("settings:display.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-6 w-6 text-muted-foreground" />
                  <Label className="text-base">
                    {t("settings:display.theme.label")}
                  </Label>
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
                          {t("settings:display.theme.system")}
                        </>
                      ) : theme === "dark" ? (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          {t("settings:display.theme.dark")}
                        </>
                      ) : (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          {t("settings:display.theme.light")}
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {t("settings:display.theme.select")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={theme || "system"}
                      onValueChange={(value) =>
                        setTheme(value as "system" | "light" | "dark")
                      }
                    >
                      <DropdownMenuRadioItem value="system">
                        <Monitor className="mr-2 h-4 w-4" />
                        {t("settings:display.theme.system")}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light">
                        <Sun className="mr-2 h-4 w-4" />
                        {t("settings:display.theme.light")}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <Moon className="mr-2 h-4 w-4" />
                        {t("settings:display.theme.dark")}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages className="h-6 w-6 text-muted-foreground" />
                  <Label className="text-base">
                    {t("settings:display.language.label")}
                  </Label>
                </div>
                <LanguageSwitcher />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("settings:display.language.description")}
              </p>
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
