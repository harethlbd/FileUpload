import CustomFileInput from "../components/CustomFileInput";
import Logo from "../components/Logo";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="">
        <Logo />
        <CustomFileInput />
      </div>
    </div>
  );
}
