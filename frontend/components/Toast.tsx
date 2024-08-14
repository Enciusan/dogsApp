import Toast from "react-native-root-toast";

export default function CustomToast(props) {
  let toast = Toast.show(`${props.message}`, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    hideOnPress: true,
  });
}
