package com.mynewproject.loading;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.mynewproject.R;

public class AppLoadingActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 로딩 화면 레이아웃 설정
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setGravity(android.view.Gravity.CENTER);
        mainLayout.setPadding(50, 50, 50, 50);

        // 앱 이름 가져오기
        Intent intent = getIntent();
        String appName = intent.getStringExtra("appName");
       // int logoResId = intent.getIntExtra("logoSource", R.drawable.default_logo);
        //int appIconResId = intent.getIntExtra("appIconSource", R.drawable.default_icon);
        String loadingMessage = intent.getStringExtra("loadingMessage");
        if (loadingMessage == null) {
            loadingMessage = "앱을 불러오고 있어요";
        }

        // 로고 이미지
        ImageView logoImage = new ImageView(this);
        //logoImage.setImageResource(logoResId);
        LinearLayout.LayoutParams logoParams = new LinearLayout.LayoutParams(200, 200);
        logoParams.bottomMargin = 50;
        logoImage.setLayoutParams(logoParams);

        // 애니메이션 설정
        TranslateAnimation animation = new TranslateAnimation(0, 0, -50, 50);
        animation.setDuration(500);
        animation.setRepeatMode(Animation.REVERSE);
        animation.setRepeatCount(Animation.INFINITE);
        logoImage.startAnimation(animation);

        // 앱 이름 텍스트
        TextView appNameText = new TextView(this);
        appNameText.setText(appName);
        appNameText.setTextSize(18);
        appNameText.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
        appNameText.setPadding(10, 10, 10, 10);
        //appNameText.setBackgroundResource(R.drawable.text_background);

        // 로딩 메시지 텍스트
        TextView loadingText = new TextView(this);
        loadingText.setText(loadingMessage);
        loadingText.setTextSize(16);
        loadingText.setPadding(10, 10, 10, 10);

        // 앱 아이콘 이미지
        ImageView appIconImage = new ImageView(this);
       // appIconImage.setImageResource(appIconResId);
        LinearLayout.LayoutParams iconParams = new LinearLayout.LayoutParams(100, 100);
        iconParams.topMargin = 50;
        appIconImage.setLayoutParams(iconParams);

        // 레이아웃 구성
        mainLayout.addView(logoImage);
        mainLayout.addView(appNameText);
        mainLayout.addView(loadingText);
        mainLayout.addView(appIconImage);

        // 레이아웃 설정
        setContentView(mainLayout);

        // 2초 후 로딩 완료 후 작업
        new Handler().postDelayed(() -> {
            String packageName = intent.getStringExtra("packageName");
            if (packageName != null) {
                Intent launchIntent = getPackageManager().getLaunchIntentForPackage(packageName);
                if (launchIntent != null) {
                    startActivity(launchIntent);
                }
            }
            finish();
        }, 2000); // 2초 대기
    }
}
