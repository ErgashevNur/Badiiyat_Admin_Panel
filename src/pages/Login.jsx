import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import signin from "/SignIn.svg";
import { toast, Toaster } from "sonner";
import { getFormData } from "../lib/utils";
import { login } from "../request";
import { useAppStore } from "../lib/zustand";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAdmin = useAppStore((state) => state.setAdmin);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const result = getFormData(e.target);
    setIsLoading(true);

    try {
      const res = await login(result);

      if (!res || res.status === "error" || !res.refreshtoken) {
        toast.error(res?.message || "Login muvaffaqiyatsiz");
        return;
      }

      toast.success("Xush kelibsiz!");
      setAdmin(res || {});

      const refreshToken = res.refreshtoken;
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/");
    } catch (err) {
      toast.error(err.message || "Loginda xatolik");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center bg-white">
      <img
        src={signin}
        className="w-[43%] h-full bg-[#C9AC8CED] px-[50px] py-[101px]"
        alt="Sign In Illustration"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white  flex flex-col mx-auto  text-black"
      >
        <h2 className="mb-5 font-slab text-[40px] font-black text-left">
          Sign in
        </h2>

        <div className="flex flex-col gap-5">
          <input
            className="w-50% rounded-xl border border-[#474747] px-[29px] py-[16px]"
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <div className="relative">
            <input
              className="w-[430px] rounded-xl border border-[#474747] px-[29px] py-[16px] pr-12"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-[39px] rounded-full bg-[#152540] max-w-[430px] w-full py-[27px] text-[18px] font-medium text-white disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" /> Iltimos kuting...
            </>
          ) : (
            "Keyingi qadam"
          )}
        </Button>
      </form>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default Login;
