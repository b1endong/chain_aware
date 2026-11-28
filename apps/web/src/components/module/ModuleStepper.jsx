import Stepper from "../ui/Stepper";

const MODULE_STEPS = ["Bài học", "Kiểm tra", "Nhận chữ ký", "Ghi on-chain"];

/** Thanh tiến trình chung cho các trang của một module. current: 0..3 (4 = hoàn tất) */
export default function ModuleStepper({ current }) {
  return (
    <div className="card module-stepper">
      <Stepper steps={MODULE_STEPS} current={current} />
    </div>
  );
}
