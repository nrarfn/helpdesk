import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/supabase";
import { useSession } from "@/context/SessionContext";

export function AuthPage() {
  const { session, user } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi input
    if (!email.trim()) {
      setErrorMessage("Email tidak boleh kosong");
      toast.error("Email tidak boleh kosong");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password tidak boleh kosong");
      toast.error("Password tidak boleh kosong");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter");
      toast.error("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting login with:", { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login response:", { data, error });

      if (error) {
        console.error("Login error:", error);
        let errorMsg = "Login gagal";
        
        // Pesan error yang lebih spesifik
        switch (error.message) {
          case "Invalid login credentials":
            errorMsg = "Email atau password salah";
            break;
          case "Email not confirmed":
            errorMsg = "Email belum dikonfirmasi. Cek email Anda untuk link konfirmasi";
            break;
          case "Too many requests":
            errorMsg = "Terlalu banyak percobaan. Coba lagi dalam beberapa menit";
            break;
          case "User not found":
            errorMsg = "Akun dengan email ini tidak ditemukan";
            break;
          default:
            errorMsg = `Login gagal: ${error.message}`;
        }
        
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        throw error;
      }

      if (data.user) {
        console.log("Login successful:", data.user);
        setSuccessMessage("Login berhasil! Mengalihkan...");
        toast.success("Login berhasil!");
        // Navigate akan dilakukan otomatis oleh useEffect saat session berubah
      }

    } catch (e) {
      const error = e as Error;
      console.error("Login catch error:", error);
      
      if (!errorMessage) {
        const fallbackMsg = error.message || "Gagal login. Periksa koneksi internet Anda";
        setErrorMessage(fallbackMsg);
        toast.error(fallbackMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle registration with email and password
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi input
    if (!email.trim()) {
      setErrorMessage("Email tidak boleh kosong");
      toast.error("Email tidak boleh kosong");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password tidak boleh kosong");
      toast.error("Password tidak boleh kosong");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter");
      toast.error("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting registration with:", { email });

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Registration response:", { data, error });

      if (error) {
        console.error("Registration error:", error);
        let errorMsg = "Registrasi gagal";
        
        switch (error.message) {
          case "User already registered":
            errorMsg = "Email sudah terdaftar. Silakan login atau gunakan email lain";
            break;
          case "Password should be at least 6 characters":
            errorMsg = "Password minimal 6 karakter";
            break;
          case "Unable to validate email address: invalid format":
            errorMsg = "Format email tidak valid";
            break;
          default:
            errorMsg = `Registrasi gagal: ${error.message}`;
        }
        
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        throw error;
      }

      if (data.user) {
        console.log("Registration successful:", data.user);
        const msg = data.user.email_confirmed_at 
          ? "Registrasi berhasil! Anda dapat login sekarang" 
          : "Registrasi berhasil! Silakan cek email untuk konfirmasi";
        setSuccessMessage(msg);
        toast.success(msg);
        
        // Clear form
        setEmail("");
        setPassword("");
      }

    } catch (e) {
      const error = e as Error;
      console.error("Registration catch error:", error);
      
      if (!errorMessage) {
        const fallbackMsg = error.message || "Gagal mendaftar. Periksa koneksi internet Anda";
        setErrorMessage(fallbackMsg);
        toast.error(fallbackMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && user) {
      // Redirect berdasarkan role user
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [session, user, navigate]);

  // Clear messages when switching tabs
  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Debug function to test Supabase connection
  const testConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      const { data, error } = await supabase.from("applications").select("count").single();
      console.log("Connection test result:", { data, error });
      
      if (error) {
        setErrorMessage(`Koneksi database gagal: ${error.message}`);
        toast.error("Masalah koneksi database");
      } else {
        console.log("Database connection OK");
      }
    } catch (e) {
      console.error("Connection test failed:", e);
      setErrorMessage("Tidak dapat terhubung ke database");
      toast.error("Masalah koneksi database");
    }
  };

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-black">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-primary/70">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md p-8 pb-18 pt-12 rounded-md shadow-md bg-white">
            <Tabs defaultValue="login" className="w-full" onValueChange={clearMessages}>
              <div className="flex flex-col items-center gap-2 mb-2 text-center">
                <img src="/logo.png" alt="logo" width={150} height={150} />
                <h1 className="text-2xl font-bold text-primary">
                  Dinas Lingkungan Hidup DKI Jakarta
                </h1>
                <p className="text-primary opacity-80 font-medium">
                  Helpdesk Application
                </p>
              </div>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab Content */}
              <TabsContent value="login">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}
                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="login-password">Password</Label>
                      </div>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sedang login..." : "Login"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab Content */}
              <TabsContent value="register">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}
                <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password">Password (minimal 6 karakter)</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sedang mendaftar..." : "Daftar"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/image.avif"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
