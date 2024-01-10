import { isError } from "@/utils";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userToken = Cookie.get("userToken");

  const router = useRouter();

  const { getFieldProps, setStatus, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await axios.post("/api/login", {
          username: values.email,
          password: values.password,
        });
        setCookie("user", JSON.stringify(response.data));
        router.push("/");
      } catch (err: any) {
        toast.error(err);

        if (isError(err)) {
          setStatus(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (userToken) {
      router.push("/");
      toast.error("You're already logged !", {
        toastId: "error_permission",
      });
    }
  }, [router, userToken]);

  if (isLoading) {
    return (
      <div className="w-full h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <section className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          PublishPulse
        </a>
        <div className="w-full rounded-lg shadow  border md:mt-0 sm:max-w-md xl:p-0  bg-gray-800  border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl  text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  Your email
                </label>
                <input
                  {...getFieldProps("email")}
                  type="email"
                  name="email"
                  id="email"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  placeholder="name@company.com"
                  data-testid="input-email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  Password
                </label>
                <input
                  {...getFieldProps("password")}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  data-testid="input-password"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                data-testid="button-submit"
                className="w-full text-white bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary-600 hover:underline  text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
