import GoogleOAuthButton from "./GoogleOAuthButton";

export default function OAuthButtons({ role }: { role: "client" | "provider" }) {
  return (
    <div className="space-y-4">
      <GoogleOAuthButton role={role} />
    </div>
  );
}
