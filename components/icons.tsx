type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logoText: (props: IconProps) => (
    <svg width='88' height='19' viewBox='0 0 88 19' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M0.2 1.2H3.56V14.976H9.824V18H0.2V1.2ZM16.0061 18.288C15.1101 18.288 14.3021 18.08 13.5821 17.664C12.8621 17.232 12.2941 16.632 11.8781 15.864C11.4621 15.08 11.2541 14.176 11.2541 13.152V5.52H14.4941V12.36C14.4941 14.424 15.3261 15.456 16.9901 15.456C17.7261 15.456 18.3421 15.2 18.8381 14.688C19.3341 14.16 19.5821 13.384 19.5821 12.36V5.52H22.8221V18H19.6781V16.128C19.3741 16.864 18.9261 17.408 18.3341 17.76C17.7421 18.112 16.9661 18.288 16.0061 18.288ZM24.7334 5.52H27.9254V7.344C28.5814 5.936 29.8534 5.232 31.7414 5.232C32.6214 5.232 33.4134 5.44 34.1174 5.856C34.8374 6.256 35.3974 6.832 35.7974 7.584C36.2294 6.8 36.7734 6.216 37.4294 5.832C38.1014 5.432 38.9654 5.232 40.0214 5.232C40.9174 5.232 41.7254 5.448 42.4454 5.88C43.1654 6.296 43.7334 6.896 44.1494 7.68C44.5654 8.448 44.7734 9.344 44.7734 10.368V18H41.5334V11.16C41.5334 10.12 41.3094 9.344 40.8614 8.832C40.4134 8.32 39.8054 8.064 39.0374 8.064C38.2214 8.064 37.5894 8.296 37.1414 8.76C36.7094 9.224 36.4934 10.024 36.4934 11.16V18H33.2534V11.16C33.2534 10.12 33.0134 9.344 32.5334 8.832C32.0534 8.32 31.3974 8.064 30.5654 8.064C29.8294 8.064 29.2134 8.328 28.7174 8.856C28.2214 9.368 27.9734 10.136 27.9734 11.16V18H24.7334V5.52ZM46.5772 5.52H49.8172V18H46.5772V5.52ZM46.2412 2.568C46.2412 2.04 46.4252 1.592 46.7932 1.224C47.1772 0.855999 47.6412 0.671999 48.1852 0.671999C48.7452 0.671999 49.2092 0.855999 49.5772 1.224C49.9452 1.592 50.1292 2.04 50.1292 2.568C50.1292 3.112 49.9452 3.568 49.5772 3.936C49.2092 4.304 48.7452 4.488 48.1852 4.488C47.6412 4.488 47.1772 4.304 46.7932 3.936C46.4252 3.552 46.2412 3.096 46.2412 2.568ZM51.7334 5.52H54.9254V7.344C55.5814 5.936 56.8534 5.232 58.7414 5.232C59.6374 5.232 60.4454 5.448 61.1654 5.88C61.8854 6.296 62.4534 6.896 62.8694 7.68C63.2854 8.448 63.4934 9.344 63.4934 10.368V18H60.2534V11.16C60.2534 10.12 60.0134 9.344 59.5334 8.832C59.0534 8.32 58.3974 8.064 57.5654 8.064C56.8294 8.064 56.2134 8.328 55.7174 8.856C55.2214 9.368 54.9734 10.136 54.9734 11.16V18H51.7334V5.52ZM70.9918 18.312C69.8718 18.312 68.8398 18.024 67.8958 17.448C66.9518 16.856 66.1998 16.064 65.6398 15.072C65.0958 14.08 64.8238 12.992 64.8238 11.808C64.8238 10.624 65.0958 9.536 65.6398 8.544C66.1998 7.536 66.9518 6.736 67.8958 6.144C68.8398 5.552 69.8718 5.256 70.9918 5.256C72.0158 5.256 72.8398 5.448 73.4638 5.832C74.1038 6.216 74.5998 6.768 74.9518 7.488V5.52H78.1678V18H75.0238V15.96C74.6558 16.712 74.1518 17.296 73.5118 17.712C72.8878 18.112 72.0478 18.312 70.9918 18.312ZM68.0638 11.784C68.0638 12.424 68.2078 13.024 68.4958 13.584C68.7998 14.128 69.2078 14.568 69.7198 14.904C70.2478 15.224 70.8478 15.384 71.5198 15.384C72.2078 15.384 72.8158 15.224 73.3438 14.904C73.8878 14.584 74.3038 14.152 74.5918 13.608C74.8798 13.064 75.0238 12.464 75.0238 11.808C75.0238 11.152 74.8798 10.552 74.5918 10.008C74.3038 9.448 73.8878 9.008 73.3438 8.688C72.8158 8.352 72.2078 8.184 71.5198 8.184C70.8478 8.184 70.2478 8.352 69.7198 8.688C69.1918 9.008 68.7838 9.44 68.4958 9.984C68.2078 10.528 68.0638 11.128 68.0638 11.784ZM80.0928 5.52H83.2368V7.896C83.4608 6.984 83.8928 6.296 84.5328 5.832C85.1888 5.368 86.0448 5.168 87.1008 5.232V8.28H86.6448C85.6848 8.28 84.8928 8.584 84.2688 9.192C83.6448 9.784 83.3328 10.592 83.3328 11.616V18H80.0928V5.52Z'
        fill='white'
      />
    </svg>
  ),
  logoDark: (props: IconProps) => (
    <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='50 25 1320.25 300' {...props}>
      <path
        d='M346.115 170.125L236.09 144.95C235.946 144.915 235.805 144.895 235.66 144.875C232.8 144.48 230.52 142.2 230.05 138.91L204.875 28.8848C204.355 26.6102 202.335 25 200 25C197.665 25 195.645 26.6102 195.125 28.8848L169.875 139.34C169.48 142.2 167.2 144.48 163.91 144.95L53.8848 170.125C51.6102 170.645 50 172.665 50 175C50 177.335 51.6102 179.355 53.8848 179.875L164.34 205.125C167.2 205.52 169.48 207.8 169.95 211.09L195.125 321.115C195.645 323.39 197.665 325 200 325C202.335 325 204.355 323.39 204.875 321.115L230.125 210.66C230.52 207.8 232.8 205.52 236.09 205.05L346.115 179.875C348.39 179.355 350 177.335 350 175C350 172.665 348.39 170.645 346.115 170.125Z'
        fill='#1A212D'></path>
      <path
        d='M443.313 81.3126H479.153V228.257H545.969V260.513H443.313V81.3126ZM611.911 263.585C602.353 263.585 593.735 261.366 586.055 256.929C578.375 252.321 572.316 245.921 567.879 237.729C563.441 229.366 561.223 219.723 561.223 208.801V127.393H595.783V200.353C595.783 222.369 604.657 233.377 622.407 233.377C630.257 233.377 636.828 230.646 642.119 225.185C647.409 219.553 650.055 211.275 650.055 200.353V127.393H684.615V260.513H651.079V240.545C647.836 248.395 643.057 254.198 636.743 257.953C630.428 261.707 622.151 263.585 611.911 263.585ZM705.003 127.393H739.051V146.849C746.048 131.83 759.616 124.321 779.755 124.321C789.141 124.321 797.589 126.539 805.099 130.977C812.779 135.243 818.752 141.387 823.019 149.409C827.627 141.046 833.429 134.817 840.427 130.721C847.595 126.454 856.811 124.321 868.075 124.321C877.632 124.321 886.251 126.625 893.931 131.233C901.611 135.67 907.669 142.07 912.107 150.433C916.544 158.625 918.763 168.182 918.763 179.105V260.513H884.203V187.553C884.203 176.459 881.813 168.182 877.035 162.721C872.256 157.259 865.771 154.529 857.579 154.529C848.875 154.529 842.133 157.003 837.355 161.953C832.747 166.902 830.443 175.435 830.443 187.553V260.513H795.883V187.553C795.883 176.459 793.323 168.182 788.203 162.721C783.083 157.259 776.085 154.529 767.211 154.529C759.36 154.529 752.789 157.345 747.499 162.977C742.208 168.438 739.563 176.63 739.563 187.553V260.513H705.003V127.393ZM938.003 127.393H972.563V260.513H938.003V127.393ZM934.419 95.9046C934.419 90.2726 936.381 85.4939 940.307 81.5686C944.403 77.6432 949.352 75.6806 955.155 75.6806C961.128 75.6806 966.077 77.6432 970.003 81.5686C973.928 85.4939 975.891 90.2726 975.891 95.9046C975.891 101.707 973.928 106.571 970.003 110.497C966.077 114.422 961.128 116.385 955.155 116.385C949.352 116.385 944.403 114.422 940.307 110.497C936.381 106.401 934.419 101.537 934.419 95.9046ZM993.003 127.393H1027.05V146.849C1034.05 131.83 1047.62 124.321 1067.75 124.321C1077.31 124.321 1085.93 126.625 1093.61 131.233C1101.29 135.67 1107.35 142.07 1111.79 150.433C1116.22 158.625 1118.44 168.182 1118.44 179.105V260.513H1083.88V187.553C1083.88 176.459 1081.32 168.182 1076.2 162.721C1071.08 157.259 1064.09 154.529 1055.21 154.529C1047.36 154.529 1040.79 157.345 1035.5 162.977C1030.21 168.438 1027.56 176.63 1027.56 187.553V260.513H993.003V127.393ZM1198.42 263.841C1186.48 263.841 1175.47 260.769 1165.4 254.625C1155.33 248.31 1147.31 239.862 1141.34 229.281C1135.53 218.699 1132.63 207.094 1132.63 194.465C1132.63 181.835 1135.53 170.23 1141.34 159.649C1147.31 148.897 1155.33 140.363 1165.4 134.049C1175.47 127.734 1186.48 124.577 1198.42 124.577C1209.35 124.577 1218.14 126.625 1224.79 130.721C1231.62 134.817 1236.91 140.705 1240.66 148.385V127.393H1274.97V260.513H1241.43V238.753C1237.51 246.774 1232.13 253.003 1225.3 257.441C1218.65 261.707 1209.69 263.841 1198.42 263.841ZM1167.19 194.209C1167.19 201.035 1168.73 207.435 1171.8 213.409C1175.04 219.211 1179.4 223.905 1184.86 227.489C1190.49 230.902 1196.89 232.609 1204.06 232.609C1211.4 232.609 1217.88 230.902 1223.51 227.489C1229.32 224.075 1233.75 219.467 1236.82 213.665C1239.9 207.862 1241.43 201.462 1241.43 194.465C1241.43 187.467 1239.9 181.067 1236.82 175.265C1233.75 169.291 1229.32 164.598 1223.51 161.185C1217.88 157.601 1211.4 155.809 1204.06 155.809C1196.89 155.809 1190.49 157.601 1184.86 161.185C1179.22 164.598 1174.87 169.206 1171.8 175.009C1168.73 180.811 1167.19 187.211 1167.19 194.209ZM1295.5 127.393H1329.04V152.737C1331.43 143.009 1336.04 135.67 1342.86 130.721C1349.86 125.771 1358.99 123.638 1370.25 124.321V156.833H1365.39C1355.15 156.833 1346.7 160.075 1340.05 166.561C1333.39 172.875 1330.06 181.494 1330.06 192.417V260.513H1295.5V127.393Z'
        fill='#1A212D'></path>
    </svg>
  ),
  logoLight: (props: IconProps) => (
    <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='50 25 1320.25 300' {...props}>
      <path
        d='M346.115 170.125L236.09 144.95C235.946 144.915 235.805 144.895 235.66 144.875C232.8 144.48 230.52 142.2 230.05 138.91L204.875 28.8848C204.355 26.6102 202.335 25 200 25C197.665 25 195.645 26.6102 195.125 28.8848L169.875 139.34C169.48 142.2 167.2 144.48 163.91 144.95L53.8848 170.125C51.6102 170.645 50 172.665 50 175C50 177.335 51.6102 179.355 53.8848 179.875L164.34 205.125C167.2 205.52 169.48 207.8 169.95 211.09L195.125 321.115C195.645 323.39 197.665 325 200 325C202.335 325 204.355 323.39 204.875 321.115L230.125 210.66C230.52 207.8 232.8 205.52 236.09 205.05L346.115 179.875C348.39 179.355 350 177.335 350 175C350 172.665 348.39 170.645 346.115 170.125Z'
        fill='white'></path>
      <path
        d='M443.313 81.3126H479.153V228.257H545.969V260.513H443.313V81.3126ZM611.911 263.585C602.353 263.585 593.735 261.366 586.055 256.929C578.375 252.321 572.316 245.921 567.879 237.729C563.441 229.366 561.223 219.723 561.223 208.801V127.393H595.783V200.353C595.783 222.369 604.657 233.377 622.407 233.377C630.257 233.377 636.828 230.646 642.119 225.185C647.409 219.553 650.055 211.275 650.055 200.353V127.393H684.615V260.513H651.079V240.545C647.836 248.395 643.057 254.198 636.743 257.953C630.428 261.707 622.151 263.585 611.911 263.585ZM705.003 127.393H739.051V146.849C746.048 131.83 759.616 124.321 779.755 124.321C789.141 124.321 797.589 126.539 805.099 130.977C812.779 135.243 818.752 141.387 823.019 149.409C827.627 141.046 833.429 134.817 840.427 130.721C847.595 126.454 856.811 124.321 868.075 124.321C877.632 124.321 886.251 126.625 893.931 131.233C901.611 135.67 907.669 142.07 912.107 150.433C916.544 158.625 918.763 168.182 918.763 179.105V260.513H884.203V187.553C884.203 176.459 881.813 168.182 877.035 162.721C872.256 157.259 865.771 154.529 857.579 154.529C848.875 154.529 842.133 157.003 837.355 161.953C832.747 166.902 830.443 175.435 830.443 187.553V260.513H795.883V187.553C795.883 176.459 793.323 168.182 788.203 162.721C783.083 157.259 776.085 154.529 767.211 154.529C759.36 154.529 752.789 157.345 747.499 162.977C742.208 168.438 739.563 176.63 739.563 187.553V260.513H705.003V127.393ZM938.003 127.393H972.563V260.513H938.003V127.393ZM934.419 95.9046C934.419 90.2726 936.381 85.4939 940.307 81.5686C944.403 77.6432 949.352 75.6806 955.155 75.6806C961.128 75.6806 966.077 77.6432 970.003 81.5686C973.928 85.4939 975.891 90.2726 975.891 95.9046C975.891 101.707 973.928 106.571 970.003 110.497C966.077 114.422 961.128 116.385 955.155 116.385C949.352 116.385 944.403 114.422 940.307 110.497C936.381 106.401 934.419 101.537 934.419 95.9046ZM993.003 127.393H1027.05V146.849C1034.05 131.83 1047.62 124.321 1067.75 124.321C1077.31 124.321 1085.93 126.625 1093.61 131.233C1101.29 135.67 1107.35 142.07 1111.79 150.433C1116.22 158.625 1118.44 168.182 1118.44 179.105V260.513H1083.88V187.553C1083.88 176.459 1081.32 168.182 1076.2 162.721C1071.08 157.259 1064.09 154.529 1055.21 154.529C1047.36 154.529 1040.79 157.345 1035.5 162.977C1030.21 168.438 1027.56 176.63 1027.56 187.553V260.513H993.003V127.393ZM1198.42 263.841C1186.48 263.841 1175.47 260.769 1165.4 254.625C1155.33 248.31 1147.31 239.862 1141.34 229.281C1135.53 218.699 1132.63 207.094 1132.63 194.465C1132.63 181.835 1135.53 170.23 1141.34 159.649C1147.31 148.897 1155.33 140.363 1165.4 134.049C1175.47 127.734 1186.48 124.577 1198.42 124.577C1209.35 124.577 1218.14 126.625 1224.79 130.721C1231.62 134.817 1236.91 140.705 1240.66 148.385V127.393H1274.97V260.513H1241.43V238.753C1237.51 246.774 1232.13 253.003 1225.3 257.441C1218.65 261.707 1209.69 263.841 1198.42 263.841ZM1167.19 194.209C1167.19 201.035 1168.73 207.435 1171.8 213.409C1175.04 219.211 1179.4 223.905 1184.86 227.489C1190.49 230.902 1196.89 232.609 1204.06 232.609C1211.4 232.609 1217.88 230.902 1223.51 227.489C1229.32 224.075 1233.75 219.467 1236.82 213.665C1239.9 207.862 1241.43 201.462 1241.43 194.465C1241.43 187.467 1239.9 181.067 1236.82 175.265C1233.75 169.291 1229.32 164.598 1223.51 161.185C1217.88 157.601 1211.4 155.809 1204.06 155.809C1196.89 155.809 1190.49 157.601 1184.86 161.185C1179.22 164.598 1174.87 169.206 1171.8 175.009C1168.73 180.811 1167.19 187.211 1167.19 194.209ZM1295.5 127.393H1329.04V152.737C1331.43 143.009 1336.04 135.67 1342.86 130.721C1349.86 125.771 1358.99 123.638 1370.25 124.321V156.833H1365.39C1355.15 156.833 1346.7 160.075 1340.05 166.561C1333.39 172.875 1330.06 181.494 1330.06 192.417V260.513H1295.5V127.393Z'
        fill='white'></path>
    </svg>
  ),
  github: (props: IconProps) => (
    <svg viewBox='0 0 438.549 438.549' {...props}>
      <path
        fill='currentColor'
        d='M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z'></path>
    </svg>
  ),
  twitter: (props: IconProps) => (
    <svg
      fill='currentColor'
      width='800px'
      height='800px'
      viewBox='0 0 1920 1920'
      xmlns='http://www.w3.org/2000/svg'
      {...props}>
      <path
        d='M1920 311.856c-70.701 33.769-146.598 56.47-226.221 66.86 81.317-52.517 143.774-135.529 173.252-234.691-76.236 48.678-160.716 84.028-250.391 103.002-71.718-82.56-174.268-134.06-287.435-134.06-217.75 0-394.165 189.966-394.165 424.206 0 33.318 3.614 65.619 10.165 96.678C617.9 616.119 327.304 447.385 133.045 190.67c-33.77 62.57-53.309 135.53-53.309 213.233 0 147.162 91.031 276.818 196.744 353.054-64.602-2.26-157.101-21.46-157.101-53.309v5.648c0 205.327 114.41 376.658 294.55 415.849-32.978 9.487-78.38 14.795-114.409 14.795-25.412 0-55.454-2.71-79.624-7.793 50.26 168.509 193.13 291.163 365.478 294.777-134.852 113.506-306.07 181.383-490.616 181.383-31.85 0-64.038-2.033-94.758-5.873 174.494 120.17 381.176 190.532 603.67 190.532 724.97 0 1121.055-646.136 1121.055-1206.55 0-18.41-.452-36.932-1.356-55.116 77.026-59.746 143.887-134.4 196.631-219.444'
        fill-rule='evenodd'
      />
    </svg>
  ),
  spinner: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}>
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  ),
};
