import { Button } from "@/components/ui/button";
import { PRODUCT_PAGE } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="center h-44">
      <Button
        onClick={() => {
          navigate(PRODUCT_PAGE);
        }}
      >
        Go to Product Page
      </Button>
    </div>
  );
}

export default Home;
