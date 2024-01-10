import { ChangeEvent, useCallback, useState, useEffect } from "react";
import { ShapeSignUp } from "@/types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FormikHelpers, useFormik } from "formik";
import { isError } from "@/utils";
import Link from "next/link";
import * as Yup from "yup";
import axios from "axios";
import Cookie from "js-cookie";
import Loading from "@/components/Loading";

const SignUpSchema = Yup.object().shape({
  profileImage: Yup.mixed().required("Profile photo is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  group: Yup.string()
    .oneOf(["client", "content-manager"], "Invalid group")
    .required("Group is required"),
});

const SignUp: React.FC = () => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userToken = Cookie.get("userToken");

  const handleSubmitLogin = useCallback(
    async (values: ShapeSignUp, help: FormikHelpers<ShapeSignUp>) => {
      try {
        setIsLoading(true);

        const response = await axios.post(
          "https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/signup",
          {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.email,
            password: values.password,
            profileImage: values.profileImage,
            group: values.group,
          }
        );

        if (response.status === 200) {
          Cookie.set("tempEmail", values.email, { expires: 1 / 24 });
          route.push("/confirm-otp");
        }
      } catch (err: any) {
        toast.error(err);
        if (isError(err)) {
          help.setStatus(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [route]
  );

  const { getFieldProps, handleSubmit, setFieldValue, values } =
    useFormik<ShapeSignUp>({
      initialValues: {
        profileImage: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        group: "",
      },
      validationSchema: SignUpSchema,
      onSubmit: handleSubmitLogin,
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
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="profileImage"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.currentTarget.files![0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFieldValue("profileImage", e.target?.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  First Name
                </label>
                <input
                  {...getFieldProps("firstName")}
                  type="text"
                  name="firstName"
                  id="firstName"
                  className=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  Last Name
                </label>
                <input
                  {...getFieldProps("lastName")}
                  type="text"
                  name="lastName"
                  id="lastName"
                  className=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  required
                />
              </div>
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
                  className=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  placeholder="name@company.com"
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
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  Confirm Password
                </label>
                <input
                  {...getFieldProps("confirmPassword")}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="group"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Select Group
                </label>
                <select
                  {...getFieldProps("group")}
                  name="group"
                  id="group"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" label="Select a group" />
                  <option value="client" label="Client" />
                  <option value="content-manager" label="Content Manager" />
                </select>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Sign Up
              </button>
              <p className="text-sm font-light text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
