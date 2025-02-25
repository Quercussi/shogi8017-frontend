import SignUpForm from "@/app/signup/SignUpForm";

export default async function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <SignUpForm />
        </div>
    );
}