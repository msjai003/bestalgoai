import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import EmailTester from '@/components/email/EmailTester';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  trading_experience: string;
  profile_picture: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to fetch profile data.",
            variant: "destructive",
          })
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching profile.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <header className="bg-charcoalSecondary py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
          <span className="text-white text-xl ml-2">BestAlgo.ai</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.profile_picture || ""} alt={profile?.full_name || "User"} />
                <AvatarFallback>{profile?.full_name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <MoreVertical className="absolute top-2 right-2 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile" className="flex items-center justify-between w-full">
                <span>Profile</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-charcoalSecondary">
              <CardHeader>
                <CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-6 w-40" />
                  ) : (
                    <>
                      Welcome, {profile?.full_name}!
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </>
                ) : (
                  <>
                    <p>Email: {profile?.email}</p>
                    <p>Mobile: {profile?.mobile_number}</p>
                    <p>Trading Experience: {profile?.trading_experience}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <EmailTester />
            
            <Card className="bg-charcoalSecondary">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" onClick={() => navigate('/smart-learn')}>
                  Go to Smart Learn
                </Button>
                <Button variant="secondary" onClick={() => navigate('/profile')}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="bg-charcoalSecondary py-4 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} BestAlgo.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
