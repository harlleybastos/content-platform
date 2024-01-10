import * as Yup from "yup";
import { useFormik } from "formik";
import { isError } from "@/utils";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import Loading from "@/components/Loading";

const ConfirmOTP: React.FC = () => {
  const router = useRouter();
  const userEmail = Cookie.get("tempEmail");
  const [isLoading, setIsLoading] = useState(false);

  const OTPSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP should be 6 digits"),
  });

  const { getFieldProps, setStatus, handleSubmit } = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OTPSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await axios.post("/api/confirm-otp", {
          otp: values.otp,
          email: userEmail,
        });

        if (response.status === 200) {
          toast.success("User successfully confirmed, please login!");
          Cookie.remove("tempEmail");
          router.push("/login");
        }
      } catch (err) {
        if (isError(err)) {
          setStatus(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

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
              Confirm Your Account
            </h1>
            <p className="text-sm font-light text-gray-400">
              Enter the 6-digit code we sent to your email.
            </p>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  OTP Code
                </label>
                <input
                  {...getFieldProps("otp")}
                  type="text"
                  name="otp"
                  id="otp"
                  maxLength={6}
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                  placeholder="123456"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Confirm
              </button>
              <p className="text-sm font-light text-gray-400">
                {"Didn't receive the code?"}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Resend
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmOTP;
