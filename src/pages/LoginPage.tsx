import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wrench, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: username, password }); // Assuming username is used as email in context
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Credenciales incorrectas. Inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 flex flex-col md:flex-row overflow-hidden relative z-10 border border-slate-100">
        {/* Left Side: Illustration/Text */}
        <div className="md:w-1/2 bg-indigo-600 p-8 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white text-indigo-600 p-3 rounded-2xl shadow-xl">
                <Wrench size={28} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">OFFICE MANAGER</h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Gestiona tu <br /> <span className="text-indigo-200">Inventario</span> con precisión.
              </h2>
              <p className="text-indigo-100 text-lg leading-relaxed max-w-md font-medium">
                La herramienta definitiva para el control de usuarios, préstamos y herramientas de oficina. Eficiente, rápido y seguro.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-12 border-t border-indigo-500/50 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400"></div>
              ))}
            </div>
            <p className="text-sm font-bold text-indigo-100 tracking-tight">
              Únete a +200 administradores <br /> en todo el mundo.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-16 bg-white">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bienvenido</h3>
              <p className="text-slate-500 font-medium">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-8 text-sm font-bold border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="username">
                  Usuario o Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all duration-300 font-bold placeholder:text-slate-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="nombre@ejemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="password">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all duration-300 font-bold placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer" />
                <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer">Recordarme en este equipo</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-300 transform active:scale-[0.98] transition-all duration-300 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar al Sistema</span>
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-slate-500 font-medium">
              ¿No tienes acceso? <button className="text-indigo-600 font-black hover:underline">Contacta al administrador</button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-8 text-center text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] hidden md:block">
        &copy; 2026 Office Manager Systems &bull; Todos los derechos reservados
      </div>
    </div>
  );
};

export default LoginPage;
