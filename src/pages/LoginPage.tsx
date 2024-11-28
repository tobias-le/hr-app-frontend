import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useAuth } from "../contexts/AuthContext";
import { AdminPanelSettings, Code, Business } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material";

// Types
interface QuickLoginUser {
  email: string;
  password: string;
  role: string;
  icon: React.ReactNode;
}

// Quick login users data
const quickLoginUsers: QuickLoginUser[] = [
  {
    email: "catherine.adams@company.com",
    password: "pass123",
    role: "HR Director - Catherine Adams",
    icon: <AdminPanelSettings />,
  },
  {
    email: "steven.wright@company.com",
    password: "pass123",
    role: "Backend Developer - Steven Wright",
    icon: <Code />,
  },
  {
    email: "emma.davis@company.com",
    password: "pass123",
    role: "Chief Operations Officer - Emma Davis",
    icon: <Business />,
  },
];

// Styled components
const PageContainer = styled.div<{ theme: Theme }>`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.palette.primary.main};
  position: relative;
  overflow: hidden;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const LoginContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input<{ theme: Theme }>`
  padding: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.palette.text.primary};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: 0 0 0 2px rgba(245, 200, 22, 0.1);
  }
`;

const LoginButton = styled.button<{ theme: Theme }>`
  padding: 0.8rem;
  background: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.primary.main};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 200, 22, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const QuickLoginSection = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuickLoginButton = styled.button<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(245, 200, 22, 0.3);
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.palette.secondary.main};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    background: rgba(30, 41, 59, 1);
    border-color: ${({ theme }) => theme.palette.secondary.main};
  }
`;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!backgroundRef.current) return;

    // Store ref in a variable that will be captured in the cleanup closure
    const currentRef = backgroundRef.current;

    // Create canvas element for better performance
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    currentRef.appendChild(canvas);

    // Create particles for time-inspired animation
    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      xSpeed: Math.random() * 0.5 - 0.25,
      ySpeed: Math.random() * 0.5 - 0.25,
    }));

    // Create flowing lines
    const lines = Array.from({ length: 8 }).map(() => ({
      points: Array.from({ length: 5 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      })),
      color:
        Math.random() > 0.5
          ? theme.palette.secondary.main
          : theme.palette.primary.light,
    }));

    // Animation timeline
    const tl = gsap.timeline();

    // Animate flowing lines
    lines.forEach((line) => {
      line.points.forEach((point) => {
        tl.to(
          point,
          {
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            duration: 10 + Math.random() * 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
          0
        );
      });
    });

    // Animation frame
    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw flowing lines
      lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);

        for (let i = 1; i < line.points.length - 2; i++) {
          const xc = (line.points[i].x + line.points[i + 1].x) / 2;
          const yc = (line.points[i].y + line.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 200, 22, ${particle.radius / 3})`;
        ctx.fill();

        particle.x += particle.xSpeed;
        particle.y += particle.ySpeed;

        // Wrap particles around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentRef) {
        currentRef.removeChild(canvas);
      }
      tl.kill();
    };
  }, [theme.palette.primary.light, theme.palette.secondary.main]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleQuickLogin = (user: QuickLoginUser) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <PageContainer theme={theme}>
      <AnimatedBackground ref={backgroundRef} />
      <LoginContainer>
        <Form onSubmit={handleSubmit}>
          <h1>time.ly</h1>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            theme={theme}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            theme={theme}
          />
          <LoginButton type="submit" theme={theme}>
            Login
          </LoginButton>
        </Form>
      </LoginContainer>

      <QuickLoginSection>
        {quickLoginUsers.map((user, index) => (
          <QuickLoginButton
            key={index}
            onClick={() => handleQuickLogin(user)}
            theme={theme}
          >
            {user.icon}
            <span>{user.role}</span>
          </QuickLoginButton>
        ))}
      </QuickLoginSection>
    </PageContainer>
  );
};

export default LoginPage;
